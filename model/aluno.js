/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 1.1
*******************************************************/

// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()


const selectAlunobyID = async function(id){
    try {
        // Realiza a consulta SQL com a junção das tabelas
        let sql = `
            SELECT 
    ta.nome AS nome_aluno,
    iu.caminho_imagem AS foto_aluno,  -- Caminho da foto do aluno
    ta.data_criacao AS data_criacao_conta,
    GROUP_CONCAT(m.nome_materia SEPARATOR ', ') AS materias_associadas,
    CASE 
        WHEN am.aluno_id IS NOT NULL THEN 'Aluno/Mentor'
        WHEN mnt.id IS NOT NULL THEN 'Aluno/Mentor'
        ELSE 'Aluno'
    END AS tipo_aluno,
    ts.nome AS nome_serie,  -- Nome da série com base no serie_id
    ta.pontos
FROM 
    tbl_alunos ta
LEFT JOIN 
    tbl_alunos_materias tam ON ta.id = tam.aluno_id
LEFT JOIN 
    tbl_materias m ON tam.materia_id = m.id
LEFT JOIN 
    tbl_aluno_mentor am ON ta.id = am.aluno_id  -- Verifica se o aluno é um mentor
LEFT JOIN 
    tbl_mentor mnt ON ta.id = mnt.id  -- Verifica se o aluno está na tabela de mentores
LEFT JOIN 
    tbl_imagens_usuario iu ON ta.imagem_id = iu.id  -- Traz o caminho da imagem do aluno
LEFT JOIN 
    tbl_series ts ON ta.serie_id = ts.id  -- Traz o nome da série com base no serie_id
WHERE 
    ta.id = ${id}  -- Substitua "1" pelo ID do aluno desejado
GROUP BY 
    ta.id;
        `;
        
        // Executa o SQL no banco de dados
        let rsAluno = await prisma.$queryRawUnsafe(sql);

        // Se a consulta retornar resultados, retornamos os dados do aluno
        if (rsAluno && rsAluno.length > 0) {
            return { aluno: rsAluno[0], status_code: 200 };
        } else {
            return { message: "Aluno não encontrado", status_code: 404 };
        }
        
    } catch (error) {
        console.log(error);
        return { message: "Erro interno no servidor", status_code: 500 };
    }
};


const selectAllAlunos = async function(){
    try {
        // Realiza a busca do genero pelo ID
        let sql = `select * from tbl_alunos where id > 0`;

        // Executa no banco de dados o script sql
        let rsAluno= await prisma.$queryRawUnsafe(sql);

            return rsAluno;
    
        } catch (error) {
            console.log(error);
            return false;
            
        }
        
}



const selectUsuarioByEmailESenha = async function(email, senha) {
    try {
        let sql = `SELECT 
    'Aluno' AS tipo_usuario,
    aluno.id AS usuario_id,
    aluno.nome AS nome_usuario,
    CASE 
        WHEN aluno_mentor.mentor_id IS NOT NULL THEN 1 
        ELSE 0 
    END AS eh_mentor,
    aluno_mentor.mentor_id AS id_mentor
FROM 
    tbl_alunos aluno
LEFT JOIN 
    tbl_aluno_mentor aluno_mentor ON aluno.id = aluno_mentor.aluno_id
WHERE 
    aluno.email = '${email}' AND aluno.senha = '${senha}'

UNION

SELECT 
    'Professor' AS tipo_usuario,
    professor.id AS usuario_id,
    professor.nome AS nome_usuario,
    CASE 
        WHEN professor_mentor.mentor_id IS NOT NULL THEN 1 
        ELSE 0 
    END AS eh_mentor,
    professor_mentor.mentor_id AS id_mentor
FROM 
    tbl_professor professor
LEFT JOIN 
    tbl_professor_mentor professor_mentor ON professor.id = professor_mentor.professor_id
WHERE 
    professor.email = '${email}' AND professor.senha = '${senha}';`;
        let rsAluno = await prisma.$queryRawUnsafe(sql);       
        
        rsAluno[0].eh_mentor = Number(rsAluno[0].eh_mentor);
        console.log(rsAluno[0]);
        
        return rsAluno;
    } catch (error) {
        console.log(error);
        return false;
    }
};


const selectUsuarioByEmail = async function(email) {
    try {
        let sql = `SELECT id FROM tbl_alunos WHERE email = '${email}';`;
        let rsAluno = await prisma.$queryRawUnsafe(sql);
        return rsAluno;
    } catch (error) {
        console.log(error);
        return false;
    }
};




const insertAluno = async function(dadosAluno) {
    try {
        let sql;

        sql = `INSERT INTO tbl_alunos (
                    nome,
                    email,
                    senha,
                    telefone,
                    data_nascimento,
                    serie,
                    foto,
                    pontos,
                    id_rank
                ) 
        VALUES 
            ('${dadosAluno.nome}',
            '${dadosAluno.email}',
            '${dadosAluno.senha}',
            '${dadosAluno.telefone}',
            '${dadosAluno.data_nascimento}',
            '${dadosAluno.serie}',
            '${dadosAluno.foto}',
            '${dadosAluno.pontos || 0}',  
            '${dadosAluno.id_rank || 1}'  
            )`; 

        console.log(sql);

        let result = await prisma.$executeRawUnsafe(sql);
        
        if (result) {
            console.log(dadosAluno);
            
            let lastID = await lastIDAluno();
            const materias = Array.isArray(dadosAluno.materias) ? dadosAluno.materias : [];
            for (let aluno of materias) {
                // Verificar se a combinação já existe
                let checkSql = `SELECT * FROM tbl_alunos_materias 
                                WHERE aluno_id = ${lastID[0].id} AND materia_id = ${aluno};`;

                let insert = await prisma.$queryRawUnsafe(checkSql);

                if (insert.length === 0) {
                    // Se não existe, insere
                    sql = `INSERT INTO tbl_alunos_materias (
                        aluno_id, 
                        materia_id
                    ) VALUES (
                        ${lastID[0].id},
                        ${aluno}
                    );`;

                    let insertResult = await prisma.$executeRawUnsafe(sql);

                    if (!insertResult) {
                        return false;
                    }
                }
            }

            // Recuperar as matérias associadas ao aluno
            const materiasAssociadas = await prisma.$queryRawUnsafe(`SELECT materia_id FROM tbl_alunos_materias WHERE aluno_id = ${lastID[0].id};`);
            return {
                ...dadosAluno,
                materias: materiasAssociadas.map(materia => materia.materia_id)
            };
        } else {
            return false;
        }

    } catch (error) {
        console.log(error);
        return false;
    }
};


// Função para adicionar aluno à sala do rank mais baixo ou criar nova sala
const adicionarAlunoASala = async function(alunoId) {

    
    try {

        console.log('eeeeeeeee');
        
        // Busca a sala com o rank mais baixo que ainda não está cheia
        let salaDisponivel = await prisma.$queryRawUnsafe(`
            SELECT id, pessoas_atual 
            FROM tbl_salas 
            WHERE id_rank = (SELECT MIN(id_rank) FROM tbl_salas) 
              AND pessoas_atual < 25 
            LIMIT 1;
        `);
        

     
        

        if (salaDisponivel.length > 0) {
            // Se uma sala disponível foi encontrada, adiciona o aluno
            let salaId = salaDisponivel[0].id;

            await prisma.$executeRawUnsafe(`
                INSERT INTO tbl_salas_alunos (sala_id, aluno_id) 
                VALUES (${salaId}, ${alunoId});
            `);

            // Aumenta o contador de alunos na sala
            await prisma.$executeRawUnsafe(`
                UPDATE tbl_salas 
                SET pessoas_atual = pessoas_atual + 1 
                WHERE id = ${salaId};
            `);

            return true; // Aluno adicionado com sucesso
        } else {
            // Se não houver sala disponível, cria uma nova sala
            let novaSalaId = await prisma.$executeRawUnsafe(`
                INSERT INTO tbl_salas (rank_id, pessoas_atual) 
                VALUES ((SELECT MIN(id) FROM ranks), 1) RETURNING id;
            `);

            // Adiciona o aluno à nova sala
            await prisma.$executeRawUnsafe(`
                INSERT INTO tbl_salas_alunos (sala_id, aluno_id) 
                VALUES (${novaSalaId}, ${alunoId});
            `);

            return true; // Aluno adicionado à nova sala com sucesso
        }
    } catch (error) {
        console.log(error);
        return false; // Falha ao adicionar o aluno à sala
    }
};



const updateAluno = async function(id, dadosAluno) {
    try {
        // Atualiza os dados do aluno na tabela tbl_alunos
        let sql = `
            UPDATE tbl_alunos
            SET 
                nome = '${dadosAluno.nome}',
                email = '${dadosAluno.email}',
                senha = '${dadosAluno.senha}',
                telefone = '${dadosAluno.telefone}',
                data_nascimento = '${dadosAluno.data_nascimento}',
                serie = '${dadosAluno.serie}',
                foto = '${dadosAluno.foto}',
                pontos = '${dadosAluno.pontos || 0}',  -- Usando valor padrão se não fornecido
                id_rank = ${dadosAluno.id_rank || 1}   -- Usando valor padrão se não fornecido
            WHERE id = ${id};
        `;

        console.log('Executando a consulta de atualização:', sql);

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            console.log(`Aluno com ID ${id} atualizado com sucesso!`);

            // Verifica se todas as matérias existem
            for (let materia of dadosAluno.materia_id) {
                let checkMateriaSql = `SELECT COUNT(*) AS count FROM tbl_materias WHERE id = ${materia};`;
                let countResult = await prisma.$queryRawUnsafe(checkMateriaSql);
                if (countResult[0].count === 0) {
                    console.log(`Erro: Matéria com ID ${materia} não encontrada.`);
                    return {
                        status: false,
                        status_code: 400,
                        message: `Matéria com ID ${materia} não encontrada.`
                    };
                }
            }

            // Remove todas as associações antigas de matérias para o aluno
            sql = `DELETE FROM tbl_alunos_materias WHERE aluno_id = ${id};`;
            result = await prisma.$executeRawUnsafe(sql);

            console.log(`Associações de matérias antigas removidas para o aluno ID ${id}.`);

            // Adiciona as novas associações de matérias
            for (let materia of dadosAluno.materia_id) {
                sql = `
                    INSERT INTO tbl_alunos_materias (aluno_id, materia_id)
                    VALUES (${id}, ${materia});
                `;

                let insertResult = await prisma.$executeRawUnsafe(sql);
                console.log(`Matéria ID ${materia} associada ao aluno ID ${id}.`);

                if (!insertResult) {
                    return {
                        status: false,
                        status_code: 500,
                        message: "Erro ao associar a matéria ao aluno."
                    };
                }
            }

            return {
                status: true,
                status_code: 200,
                message: "Atualização realizada com sucesso!",
            };
        } else {
            console.log('Erro: Atualização não retornou resultado.');
            return {
                status: false,
                status_code: 500,
                message: "Falha ao atualizar o aluno."
            };
        }
    } catch (error) {
        console.error('Erro ao acessar o banco de dados:', error);
        return {
            status: false,
            status_code: 500,
            message: "Não foi possível processar a requisição, devido a um erro: " + error.message
        };
    }
};



const lastIDAluno = async function(){
    try {
        let sql = `SELECT id FROM tbl_alunos ORDER BY id DESC LIMIT 1;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}

const deleteAluno = async(id) =>{
    try{

        let sql = `delete from tbl_alunos where id = ${id}`
       
    
        //Executa o sql no banco de dados
        let rsdeleteUsuario = await prisma.$executeRawUnsafe(sql)

    
       return rsdeleteUsuario
    
        } catch(error){
            return false
        }
}



const selectAlunosRank = async function(salaId) {
    try {
        // Realiza a busca dos alunos na sala especificada
        let sql = `
           SELECT *
    FROM vw_alunos_ranking_sala
    JOIN tbl_salas_alunos ON vw_alunos_ranking_sala.id_aluno = tbl_salas_alunos.aluno_id
    WHERE tbl_salas_alunos.sala_id = ${salaId};
        `;

        // Executa no banco de dados o script SQL
        let rsAluno = await prisma.$queryRawUnsafe(sql);

        return rsAluno;

    } catch (error) {
        console.log(error);
        return false;
    }
}


// Função para atualizar a senha do aluno
const updateSenhaAluno = async function(id, novaSenha) {
    try {
        let sql = `UPDATE tbl_alunos 
                   SET senha = '${novaSenha}' 
                   WHERE id = ${id};`;
        let resultado = await prisma.$executeRawUnsafe(sql);
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
};


const selectSenhaById = async function(id) {
    try {
        let sql = `SELECT senha FROM tbl_alunos WHERE id = ${id};`;
        let rsAluno = await prisma.$queryRawUnsafe(sql);
        
        return rsAluno;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const selectAlunoDetailsbyID = async function(id) {
    try {
        // Realiza a consulta SQL para pegar nome, email, senha, foto e data de criação do aluno
        let sql = `
            SELECT 
                ta.nome AS nome_aluno,
                ta.email AS email_aluno,
                ta.senha AS senha_aluno,
                iu.caminho_imagem AS foto_aluno,  -- Caminho da foto do aluno
                ta.data_criacao AS data_criacao_conta
            FROM 
                tbl_alunos ta
            LEFT JOIN 
                tbl_imagens_usuario iu ON ta.imagem_id = iu.id  -- Traz o caminho da imagem do aluno
            WHERE 
                ta.id = ${id};  -- Substitua "id" pelo ID do aluno desejado
        `;
        
        // Executa o SQL no banco de dados
        let rsAluno = await prisma.$queryRawUnsafe(sql);

        // Se a consulta retornar resultados, retornamos os dados do aluno
        if (rsAluno && rsAluno.length > 0) {
            return { aluno: rsAluno[0], status_code: 200 };
        } else {
            return { message: "Aluno não encontrado", status_code: 404 };
        }
        
    } catch (error) {
        console.log(error);
        return { message: "Erro interno no servidor", status_code: 500 };
    }
};


module.exports ={
    selectAlunoDetailsbyID,
    adicionarAlunoASala,
    selectAllAlunos,
    selectAlunobyID,
    lastIDAluno,
    deleteAluno,
    insertAluno,
    updateAluno,
    selectUsuarioByEmailESenha,
    selectAlunosRank,
    updateSenhaAluno,
    selectUsuarioByEmail,
    selectSenhaById

}

