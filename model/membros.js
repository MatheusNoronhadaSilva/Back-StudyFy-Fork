/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 1.1
*******************************************************/

// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client');

// Instacia da classe PrismaClient
const prisma = new PrismaClient()


const selectAllMembros = async function () {
    try {
        // Realiza a busca do genero pelo ID
        let sql = `SELECT 
    a.id AS aluno_id,
    a.nome AS aluno_nome,
    a.email AS aluno_email,
    gm.nome AS grupo_mentoria_nome
FROM 
    tbl_membros m
JOIN 
    tbl_alunos a ON m.aluno_id = a.id
JOIN 
    tbl_grupo_mentoria gm ON m.grupo_mentoria_id = gm.id;`;

        // Executa no banco de dados o script sql
        let rsMembros = await prisma.$queryRawUnsafe(sql);

        return rsMembros;

    } catch (error) {
        console.log(error);
        return false;

    }

}


const selectByIdMembro = async function (id) {
    try {

        let sql = `SELECT 
    a.id AS aluno_id,
    a.nome AS aluno_nome,
    a.email AS aluno_email,
    gm.nome AS grupo_mentoria_nome
FROM 
    tbl_membros m
JOIN 
    tbl_alunos a ON m.aluno_id = a.id
JOIN 
    tbl_grupo_mentoria gm ON m.grupo_mentoria_id = gm.id
WHERE 
    gm.id IN (${id})`;

        console.log(sql);

        let rsMateria = await prisma.$queryRawUnsafe(sql)
        return rsMateria

    } catch (error) {
        console.log(error);

        return false
    }
}

const selectMembrosMentores = async function () {
    try {
        // Realiza a busca do genero pelo ID
        let sql = `  SELECT 
    membros.id AS membro_id,
    alunos.nome AS aluno_nome,
    alunos.email AS aluno_email,
    grupo_mentoria.nome AS grupo_mentoria_nome,
    mentor.id AS mentor_id
FROM 
    tbl_membros AS membros
JOIN 
    tbl_alunos AS alunos ON membros.aluno_id = alunos.id
JOIN 
    tbl_grupo_mentoria AS grupo_mentoria ON membros.grupo_mentoria_id = grupo_mentoria.id
JOIN 
    tbl_mentor AS mentor ON grupo_mentoria.mentor_id = mentor.id;`;

        // Executa no banco de dados o script sql
        let rsMembros = await prisma.$queryRawUnsafe(sql);

        return rsMembros;

    } catch (error) {
        console.log(error);
        return false;

    }

}

const adicionarAlunoAoGrupo = async (alunoId, grupoMentoriaId) => {
    try {

        sql = `INSERT INTO tbl_membros (aluno_id, grupo_mentoria_id) VALUES
        (${alunoId}, ${grupoMentoriaId});
        `

        console.log(sql);
        // Adiciona o aluno ao grupo de mentoria
        const resultNovoMembro = await prisma.$executeRawUnsafe(sql)

        // Retorna os dados do novo membro adicionado
        return resultNovoMembro;
    } catch (error) {
        console.error('Erro ao adicionar aluno ao grupo:', error);
        return null;  // Retorna null em caso de erro
    }
};

//adicionar

const deletarMembroGrupo = async (alunoId, grupoMentoriaId) => {
    try {

               // Primeiro, exclua as respostas de dúvida relacionadas ao membro
               const sqlDeleteRespostas = `
               DELETE FROM tbl_resposta_duvida
               WHERE duvida_compartilhada_id IN (
                   SELECT id FROM tbl_duvida_compartilhada
                   WHERE membro_id = ${alunoId}
               );
           `;
           await prisma.$executeRawUnsafe(sqlDeleteRespostas);

        // Remover as referências do membro na tabela 'tbl_duvida_compartilhada'
        const sqlDeleteDuvida = `
                DELETE FROM tbl_duvida_compartilhada
                WHERE membro_id = ${alunoId};
            `;
        await prisma.$executeRawUnsafe(sqlDeleteDuvida);

        sql = `DELETE FROM tbl_membros 
        WHERE aluno_id = ${alunoId} AND grupo_mentoria_id = ${grupoMentoriaId};
        `

        console.log(sql);
        // Adiciona o aluno ao grupo de mentoria
        const resultNovoMembro = await prisma.$executeRawUnsafe(sql)

        // Retorna os dados do novo membro adicionado
        return resultNovoMembro;
    } catch (error) {
        console.error('Erro ao deletar aluno ao grupo:', error);
        return null;  // Retorna null em caso de erro
    }
};



module.exports = {
    deletarMembroGrupo,
    adicionarAlunoAoGrupo,
    selectAllMembros,
    selectByIdMembro,
    selectMembrosMentores
}
