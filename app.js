/****************************************************************
 * Objetivo: Arquivo responsavel pelos endpoints
 * Data: 03/09/2024
 * Autor: Ricardo
 * Versão: 1.0
 ****************************************************************/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) =>{

    // Permite especificar quem podera acessar a API ('*' = Liberar acesso público, 'IP' = Liberar acesso apenas para aquela maquina);
    response.header('Access-Control-Allow-Origin', '*')

    // Permite especificar como a API, sera requisitada ('GET', 'POST', 'PUT' e 'DELETE')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Ativa as confgurações de cors
    app.use(cors())


    next()
})

/*********************** Import dos arquivos de controller do projeto ***********************************/
const controllerAluno = require('./controller/controller_aluno.js')
const controllerMateria = require('./controller/controller_materia.js')
const controllerProfessor = require ('./controller/controller_professor.js')
const controllerMentor = require ('./controller/controller_mentor.js')
const controllerGrupoMentoria = require ('./controller/controller_grupoMentoria.js')
const controllerMembros = require ('./controller/controller_membros.js')
const controllerTipoQuestoes = require ('./controller/controller_tipoQuestao.js')
const controllerDuvidaCompartilhada = require ('./controller/controller_duvidaCompartilhada.js')
const controllerRespostaDuvida = require ('./controller/controller_respostaDuvida.js')
const controllerQuestao = require ('./controller/controller_questao.js')
const controllerAtividade = require ('./controller/controller_atividadeGrupoMentoria.js')
const controllerOrdemPalavra = require ('./controller/controller_ordemPalavra.js')
const controllerRespostaLacunas = require ('./controller/controller_respostaLacunas.js')
const controllerRespostaCorrespondencia = require ('./controller/controller_respostaCorrespondencia.js')
const controllerRespostaMultipla = require ('./controller/controller_respostaMultipla.js')
const controllerRespostaVerdadeiroFalso = require ('./controller/controller_verdadeiroFalso.js')
const controllerSalas = require ('./controller/controller_salas.js')
const controllerRank = require ('./controller/controller_rank.js')
const controllerTemporadas = require ('./controller/controller_temporada.js')
const controllerEmblema = require ('./controller/controller_emblema.js')
const controllerNivelEmblema = require ('./controller/controller_nivelEmblema.js')
const controllerAlunoEmblema = require ('./controller/controller_alunoEmblema.js')
const controllerImgsGrupoMentoria = require ('./controller/controller_imgsGrupoMentoria.js')
const controllerCadernoVirtual = require ('./controller/controller_cadernoVirtual.js')
const controllerSeries = require('./controller/controller_series')
/*******************************************************************************************************/

// Criando um objeto para controlar a chegada dos dados da requisição em formato JSON
const bodyParserJSON = bodyParser.json()


//       --------------------   CRUD ALUNOS  ---------------------        //


    // -> EndPoint: Versão 2.0 - Retorna os dados de produtos do Banco de Dados
    app.get('/v1/studyfy/alunos', cors(), async function(request, response){

        // -> Chama a função da controller para retornar todos os filmes
        let dadosAlunos = await controllerAluno.getListarAluno()

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosAlunos.status_code)
        response.json(dadosAlunos)
    })


    app.put('/v1/studyFy/aluno-senha/:id', cors(), bodyParserJSON, async function(request, response){
        let contentType = request.headers['content-type']
        let dadosBody = request.body
        let idAluno = request.params.id

        let dadosAluno = await controllerAluno.setAtualizarSenhaAluno(idAluno, dadosBody, contentType)

      response.status(dadosAluno.status_code)
      response.json(dadosAluno)
    })
    
   

    // // EndPoint: ele retorna os dados pelo id
app.get('/v1/studyFy/aluno/:id', cors(), async function(request, response) {
    // Recebe o ID da requisição
    let idAluno = request.params.id;

    // Encaminha o ID para o model buscar os dados do aluno
    let dadosAluno = await controllerAluno.getBuscarAlunoId(idAluno);

    // Envia a resposta com o status e dados do aluno
    response.status(dadosAluno.status_code).json(dadosAluno);
});

app.get('/v1/studyFy/aluno/config/:id', async function (request, response) {
    const idAluno = request.params.id;  // Obtém o ID do aluno da URL
    try {
        // Chama o controlador para buscar os dados do aluno
        const dadosAluno = await controllerAluno.getAlunoDetails(idAluno);

        // Verifica se os dados foram encontrados e responde
        if (dadosAluno) {
            response.status(200).json(dadosAluno);
        } else {
            response.status(404).json({ message: 'Aluno não encontrado' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Erro interno no servidor' });
    }
});


    // //EndPoint: Ele insere dados sobre o filme
    app.post('/v1/studyFy/aluno', cors(), bodyParserJSON, async function(request, response){

        // Recebe o content-type da requisição
        let contentType = request.headers['content-type']

        //Recebe todos os dados encaminhados na requisição pelo Body
        let dadosBody = request.body

        //Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoAluno = await controllerAluno.setInserirNovoAluno(dadosBody, contentType)
        console.log(resultDadosNovoAluno);
        response.status(resultDadosNovoAluno.status_code)
        response.json(resultDadosNovoAluno)
    })

     //EndPoint: Ele deleta os dados pelo id 
    app.delete('/v1/studyFy/alunos/:id', cors(), async function(request, response, next){
        let idAluno = request.params.id

        let dadosAluno = await controllerAluno.setExcluirAluno(idAluno)

        response.status(dadosAluno.status_code)
        response.json(dadosAluno)
    })

     app.put('/v1/studyFy/alunos/:id', cors(), bodyParserJSON, async function(request, response){
         let contentType = request.headers['content-type']
         let dadosBody = request.body
         let idAluno = request.params.id

         let dadosAluno = await controllerAluno.setAtualizarAluno(idAluno, dadosBody, contentType)

       response.status(dadosAluno.status_code)
       response.json(dadosAluno)
     })


     //       --------------------   CRUD PROFESSORES  ---------------------        //


    // -> EndPoint: Versão 2.0 - Retorna os dados de produtos do Banco de Dados
    app.get('/v1/studyfy/professores', cors(), async function(request, response){

        // -> Chama a função da controller para retornar todos os filmes
        let dadosProfessores = await controllerProfessor.getListarProfessor()

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosProfessores.status_code)
        response.json(dadosProfessores)
    })

    // // EndPoint: ele retorna os dados pelo id
    app.get('/v1/studyFy/professor/:id', cors(), async function(request, response){

        // Recebe o id da requisição
        let idProfessor = request.params.id
        // Encaminha o ID para a controller buscar o Filme
        let dadosProfessores = await controllerProfessor.getBuscarProfessorId(idProfessor)

        
        response.status(dadosProfessores.status_code)
        response.json(dadosProfessores)
    })

    // //EndPoint: Ele insere dados sobre o filme
    app.post('/v1/studyFy/professores', cors(), bodyParserJSON, async function(request, response){

        // Recebe o content-type da requisição
        let contentType = request.headers['content-type']

        //Recebe todos os dados encaminhados na requisição pelo Body
        let dadosBody = request.body

        //Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoProfessor = await controllerProfessor.setInserirNovoProfessor(dadosBody, contentType)
        
        response.status(resultDadosNovoProfessor.status_code)
        response.json(resultDadosNovoProfessor)
    })

     //EndPoint: Ele deleta os dados pelo id 
    app.delete('/v1/studyFy/professores/:id', cors(), async function(request, response, next){
        let idProfessor = request.params.id

        let dadosProfessores = await controllerProfessor.setExcluirProfessor(idProfessor)

        response.status(dadosProfessores.status_code)
        response.json(dadosProfessores)
    })

     app.put('/v1/studyFy/professores/:id', cors(), bodyParserJSON, async function(request, response){
         let contentType = request.headers['content-type']
         let dadosBody = request.body
         let idProfessor = request.params.id

         let dadosProfessores = await controllerProfessor.setAtualizarProfessor(idProfessor, dadosBody, contentType)

       response.status(dadosProfessores.status_code)
       response.json(dadosProfessores)
     })


      //       --------------------   CRUD MATERIA  ---------------------        //

      app.get('/v1/studyfy/materias', cors(), async function(request, response){

        // -> Chama a função da controller para retornar todos os filmes
        let dadosMaterias = await controllerMateria.getListarMaterias()

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosMaterias.status_code)
        response.json(dadosMaterias)
    })

    app.get('/v1/studyfy/alunos/materias/:id', cors(), async function(request, response){

        let idAluno = request.params.id

        let dadosMaterias = await controllerMateria.getListarMateriasByIdAluno(idAluno)

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosMaterias.status_code)
        response.json(dadosMaterias)
    })


     // //EndPoint: Ele insere dados sobre o filme
     app.post('/v1/studyFy/materias', cors(), bodyParserJSON, async function(request, response){

        // Recebe o content-type da requisição
        let contentType = request.headers['content-type']

        //Recebe todos os dados encaminhados na requisição pelo Body
        let dadosBody = request.body

        //Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovaMateria = await controllerMateria.setInserirNovaMateria(dadosBody, contentType)
        
        response.status(resultDadosNovaMateria.status_code)
        response.json(resultDadosNovaMateria)
    })

     //EndPoint: Ele deleta os dados pelo id 
    app.delete('/v1/studyFy/materias/:id', cors(), async function(request, response, next){
        let idMateria = request.params.id

        let dadosMaterias = await controllerMateria.setExcluirMateria(idMateria)

        response.status(dadosMaterias.status_code)
        response.json(dadosMaterias)
    })

     app.put('/v1/studyFy/materias/:id', cors(), bodyParserJSON, async function(request, response){
         let contentType = request.headers['content-type']
         let dadosBody = request.body
         let idMateria = request.params.id

         let dadosMaterias = await controllerMateria.setAtualizarMateria(idMateria, dadosBody, contentType)

       response.status(dadosMaterias.status_code)
       response.json(dadosMaterias)
     })

    
 //       --------------------   CRUD MENTOR  ---------------------        //



 app.get('/v1/studyfy/mentor', cors(), async function(request, response){

        // -> Chama a função da controller para retornar todos os filmes
        let dadosMentor = await controllerMentor.getListarMentores()

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosMentor.status_code)
        response.json(dadosMentor)
    })

    app.get('/v1/studyfy/aluno/mentor/:id', cors(), async function(request, response){

        let idAlunoMentor = request.params.id

        let dadosAlunosMentores = await controllerAluno.getListarAlunosMentores(idAlunoMentor)

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosAlunosMentores.status_code)
        response.json(dadosAlunosMentores)
    })

    app.get('/v1/studyfy/professor/mentor/:id', cors(), async function(request, response){

        let idProfessorMentor = request.params.id

        let dadosProfessoresMentores = await controllerProfessor.getListarProfessoresMentores(idProfessorMentor)

        // -> validação para verificar se existem dados a serem retornados
        response.status(dadosProfessoresMentores.status_code)
        response.json(dadosProfessoresMentores)
    })

    app.post('/v1/studyFy/mentor', cors(), bodyParserJSON, async function(request, response) {
        // Recebe o content-type da requisição
        let contentType = request.headers['content-type'];
    
        // Recebe todos os dados encaminhados na requisição pelo Body
        let dadosBody = request.body;
    
        // Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoMentor = await controllerMentor.setInserirNovoMentor(dadosBody, contentType);
        console.log(resultDadosNovoMentor);
        response.status(resultDadosNovoMentor.status_code);
        response.json(resultDadosNovoMentor);
    });

    app.delete('/v1/studyFy/mentor/:id', cors(), async function (request, response) {
        // Recebe o parâmetro id da URL
        let idMentor = request.params.id;
    
        // Encaminha o ID para a controller
        let resultadoRemocaoMentor = await controllerMentor.setRemoverMentor(idMentor);
    
        response.status(resultadoRemocaoMentor.status_code);
        response.json(resultadoRemocaoMentor);
    });
    

// --------------------   CRUD DE SERIES ----------------------------

app.get('/v1/studyfy/series', cors(), async function(request, response){

    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosSeries = await controllerSeries.getSeries();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosSeries.status_code);
        response.json(dadosSeries);
    } catch (error) {
        console.error('Erro ao listar series:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
})

app.get('/v1/studyfy/series/aluno/:id', cors(), async function(request, response){

    try {

        let idAluno = request.params.id;

        let dadosSeriesAluno = await controllerSeries.getSerieAlunoESeries(idAluno);
        
        response.status(dadosSeriesAluno.status_code);
        response.json(dadosSeriesAluno);
    } catch (error) {
        console.error('Erro ao listar series e serie do aluno:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
})

// --------------------   CRUD GRUPO DE DE MENTORIA  ---------------------        

app.get('/v1/studyfy/mentorias', cors(), async function(request, response) {
    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosMentorias = await controllerGrupoMentoria.getListarGruposMentoria();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosMentorias.status_code);
        response.json(dadosMentorias);
    } catch (error) {
        console.error('Erro ao listar grupos de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Retorna um grupo de mentoria pelo ID
app.get('/v1/studyfy/mentoria/:id', cors(), async function(request, response) {
    try {
        // Recebe o ID da requisição
        let idMentoria = request.params.id;
        
        // Encaminha o ID para a controller buscar o grupo de mentoria
        let dadosMentoria = await controllerGrupoMentoria.getBuscarGrupoMentoriaId(idMentoria);
        
        response.status(dadosMentoria.status_code);
        response.json(dadosMentoria);
    } catch (error) {
        console.error('Erro ao buscar grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Insere um novo grupo de mentoria
app.post('/v1/studyfy/mentorias', cors(), bodyParserJSON, async function(request, response) {
    try {
        // Recebe o content-type da requisição
        let contentType = request.headers['content-type'];
        
        // Recebe todos os dados encaminhados na requisição pelo body
        let dadosBody = request.body;
        
        // Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovaMentoria = await controllerGrupoMentoria.setInserirNovoGrupoMentoria(dadosBody, contentType);
        
        response.status(resultDadosNovaMentoria.status_code);
        response.json(resultDadosNovaMentoria);
    } catch (error) {
        console.error('Erro ao inserir grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Deleta um grupo de mentoria pelo ID
app.delete('/v1/studyfy/mentorias/:id', cors(), async function(request, response) {
    try {
        let idMentoria = request.params.id;
        
        let dadosMentoria = await controllerGrupoMentoria.setExcluirGrupoMentoria(idMentoria);
        
        response.status(dadosMentoria.status_code);
        response.json(dadosMentoria);
    } catch (error) {
        console.error('Erro ao excluir grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Atualiza um grupo de mentoria pelo ID
app.put('/v1/studyfy/mentorias/:id', cors(), bodyParserJSON, async function(request, response) {
    try {
        let contentType = request.headers['content-type'];
        let dadosBody = request.body;
        let idMentoria = request.params.id;
        
        let dadosMentoria = await controllerGrupoMentoria.setAtualizarGrupoMentoria(idMentoria, dadosBody, contentType);
        
        response.status(dadosMentoria.status_code);
        response.json(dadosMentoria);
    } catch (error) {
        console.error('Erro ao atualizar grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


app.get('/v1/studyfy/gruposMentoria/:id', cors(), async function(request, response) {
    try {

        console.log('yyyy');

        let dadosBody = request.params.id;        

        console.log(dadosBody);

        const resultadoGrupos = await controllerGrupoMentoria.getInformacoesTodosGruposMentoria(dadosBody);

        if (!resultadoGrupos || resultadoGrupos.length === 0) {
            return response.status(404).json({ message: 'Nenhum grupo de mentoria encontrado.' });
        }

        response.status(200).json(resultadoGrupos);
    } catch (error) {
        console.error('Erro ao buscar informações dos grupos de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

app.get('/v1/studyfy/grupoMentoriaAluno/:id', cors(), async function(request, response) {
    try {
        // Recebe todos os dados encaminhados na requisição pelo body
        let dadosBody = request.params.id;

        console.log(dadosBody);
        
        
        // Encaminha os dados para a controller
        let result = await controllerGrupoMentoria.getGruposMentoriasAluno(dadosBody);
        
        // Define o status da resposta e envia os dados de volta
        response.status(200);
        response.json(result);
    } catch (error) {
        console.error('Erro ao buscar os grupos no qual faz parte:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

app.get('/v1/studyfy/mentorGrupo/:id', async function(request, response) {
    try {
        const idMentoria = request.params.id;
        const dadosMentoria = await controllerGrupoMentoria.getMentorByGrupoId(idMentoria);
        
        response.status(dadosMentoria.status_code);
        response.json(dadosMentoria);
    } catch (error) {
        console.error('Erro ao buscar mentor do grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});





  


// --------------------   CRUD DE MEMBROS  --------------------- 


app.get('/v1/studyfy/membros/grupo', cors(), async function(request, response) {
    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosMembros = await controllerMembros.getListarMembros();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosMembros.status_code);
        response.json(dadosMembros);
    } catch (error) {
        console.error('Erro ao listar os membros:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});



app.get('/v1/studyfy/membros/grupo/:id', cors(), async function(request, response) {
    try {
        // Recebe o ID da requisição
        let idMembros = request.params.id;
        
        // Encaminha o ID para a controller buscar o grupo de mentoria
        let dadosMembros = await controllerMembros.getBuscarMembroId(idMembros);
        
        response.status(dadosMembros.status_code);
        response.json(dadosMembros);
    } catch (error) {
        console.error('Erro ao buscar grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


app.get('/v1/studyfy/membros/mentor', cors(), async function(request, response) {
    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosMembrosMentores = await controllerMembros.getListarMembrosMentores();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosMembrosMentores.status_code);
        response.json(dadosMembrosMentores);
    } catch (error) {
        console.error('Erro ao listar os membros:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

app.post('/v1/studyfy/membros/grupo', cors(), bodyParser.json(), async function(request, response) {
    try {

        console.log('oiiiii');
        // Recebe o content-type da requisição
        let contentType = request.headers['content-type'];
        
        // Recebe todos os dados encaminhados na requisição pelo body
        let dadosBody = request.body;
        console.log(dadosBody);

        
        // Encaminha os dados para o controller para adicionar o aluno ao grupo
        let resultDadosAdicionarAluno = await controllerMembros.setInserirAlunoAoGrupo(dadosBody, contentType);
        
        // Retorna o status e os dados resultantes
        response.status(resultDadosAdicionarAluno.status_code);
        response.json(resultDadosAdicionarAluno);
    } catch (error) {
        console.error('Erro ao adicionar aluno ao grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Remove um membro de um grupo de mentoria
app.delete('/v1/studyfy/mentoria/membro', cors(), bodyParserJSON, async function(request, response) {
    try {
        console.log('saindo');
        
        // Recebe o content-type da requisição
        let contentType = request.headers['content-type'];
        
        // Recebe os dados encaminhados na requisição pelo body
        let dadosBody = request.body;

        console.log(dadosBody);
        
        
        // Encaminha os dados para a controller enviar para o DAO
        let resultRemoverMembro = await controllerMembros.setRemoverMembroGrupo(dadosBody, contentType);
        
        console.log(resultRemoverMembro);
        
        response.status(200);
        response.json(resultRemoverMembro);
    } catch (error) {
        console.error('Erro ao remover membro do grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});




// --------------------   CRUD TIPO QUESTAO  ---------------------        

app.get('/v1/studyfy/tipoQuestao', cors(), async function(request, response) {
    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosTipoQuestao = await controllerTipoQuestoes.getTipoQuestao();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosTipoQuestao.status_code);
        response.json(dadosTipoQuestao);
    } catch (error) {
        console.error('Erro ao listar tipo questao:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Retorna um grupo de mentoria pelo ID
app.get('/v1/studyfy/tipoQuestao/:id', cors(), async function(request, response) {
    try {
        // Recebe o ID da requisição
        let idTipoQuestao = request.params.id;
        
        // Encaminha o ID para a controller buscar o grupo de mentoria
        let dadosTipoQuestao = await controllerTipoQuestoes.getBuscarTipoQuestaoId(idTipoQuestao);
        
        response.status(dadosTipoQuestao.status_code);
        response.json(dadosTipoQuestao);
    } catch (error) {
        console.error('Erro ao buscar grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

//pegar dados de uma atividade
app.get('/v1/studyfy/atividades/:materiaId/:serieId', cors(), async function(request, response) {
    try {
        // Recebe os parâmetros da requisição
        let materiaId = request.params.materiaId;
        let serieId = request.params.serieId;
        
        // Valida os parâmetros
        if (!materiaId || !serieId) {
            return response.status(400).json({ status_code: 400, message: 'Parâmetros inválidos: materia_id e serie_id são obrigatórios' });
        }

        // Chama a controller para buscar as atividades
        let dadosAtividades = await controllerQuestao.getBuscarAtividades(materiaId, serieId);

        // Retorna a resposta
        response.status(dadosAtividades.status_code);
        response.json(dadosAtividades);
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


app.get('/v1/studyfy/questoesPorAtividade/:atividade_id', cors(), async function(request, response) {
    try {
        // Recebe o ID da atividade (atividade_id) da requisição
        let atividadeId = request.params.atividade_id;
        
        // Encaminha o atividadeId para a controller buscar as questões da atividade
        let dadosQuestoes = await controllerQuestao.getBuscarQuestoesPorAtividade(atividadeId);
        
        response.status(dadosQuestoes.status_code);
        response.json(dadosQuestoes);
    } catch (error) {
        console.error('Erro ao buscar questões da atividade:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

app.get('/v1/studyfy/atividadesFeitas/:atividade_id/:aluno_id', cors(), async function(request, response) {
    try {
        
        // Recebe o ID da atividade (atividade_id) da requisição
        let atividadeId = request.params.atividade_id;
        let alunoId = request.params.aluno_id
        
        
        // Encaminha o atividadeId para a controller buscar as questões da atividade
        let dadosQuestoes = await controllerQuestao.getBuscarAtividadesFeitas(atividadeId, alunoId);
        
        response.status(dadosQuestoes.status_code);
        response.json(dadosQuestoes);
    } catch (error) {
        console.error('Erro ao buscar questões da atividade:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});






// Endpoint: Insere um novo grupo de mentoria
app.post('/v1/studyfy/tipoQuestao', cors(), bodyParserJSON, async function(request, response) {
    try {
        // Recebe o content-type da requisição
        let contentType = request.headers['content-type'];
        
        // Recebe todos os dados encaminhados na requisição pelo body
        let dadosBody = request.body;
        
        // Encaminha os dados para a controller enviar para o DAO
        let resultDadosNovoTipoQuestao = await controllerTipoQuestoes.setInserirNovoTipoQuestao(dadosBody, contentType);
        
        response.status(resultDadosNovoTipoQuestao .status_code);
        response.json(resultDadosNovoTipoQuestao );
    } catch (error) {
        console.error('Erro ao inserir grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


// Endpoint: Deleta um grupo de mentoria pelo ID
app.delete('/v1/studyfy/tipoQuestao/:id', cors(), async function(request, response) {
    try {
        let idTipoQuestao = request.params.id;
        
        let dadosTipoQuestao = await controllerTipoQuestoes.setExcluirTipoQuestao(idTipoQuestao);
        
        response.status(dadosTipoQuestao.status_code);
        response.json(dadosTipoQuestao);
    } catch (error) {
        console.error('Erro ao excluir grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Atualiza um grupo de mentoria pelo ID
app.put('/v1/studyfy/tipoQuestao/:id', cors(), bodyParserJSON, async function(request, response) {
    try {
        let contentType = request.headers['content-type'];
        let dadosBody = request.body;
        let idTipoQuestao = request.params.id;
        
        let dadosTipoQuestao = await controllerTipoQuestoes.setAtualizarTipoQuestao(idTipoQuestao, dadosBody, contentType);
        
        response.status(dadosTipoQuestao.status_code);
        response.json(dadosTipoQuestao);
    } catch (error) {
        console.error('Erro ao atualizar grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});



// --------------------   CRUD DE DUVIDA COMPARTILHADA  --------------------- 


app.get('/v1/studyfy/duvidaCompartilhada', cors(), async function(request, response) {
    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosDuvidaCompartilhada = await controllerDuvidaCompartilhada.getListarAllDuvidas();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosDuvidaCompartilhada.status_code);
        response.json(dadosDuvidaCompartilhada);
    } catch (error) {
        console.error('Erro ao listar os membros:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


app.get('/v1/studyfy/duvidaCompartilhada/Respondida', cors(), async function(request, response) {
    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosDuvidaCompartilhada = await controllerDuvidaCompartilhada.getListarDuvidasRespondidas();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosDuvidaCompartilhada.status_code);
        response.json(dadosDuvidaCompartilhada);
    } catch (error) {
        console.error('Erro ao listar os membros:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


app.get('/v1/studyfy/duvidaCompartilhada/NaoRespondida', cors(), async function(request, response) {
    try {
        // Chama a função da controller para retornar todos os grupos de mentoria
        let dadosDuvidaCompartilhada = await controllerDuvidaCompartilhada.getListarDuvidasNaoRespondidas();
        
        // Validação para verificar se existem dados a serem retornados
        response.status(dadosDuvidaCompartilhada.status_code);
        response.json(dadosDuvidaCompartilhada);
    } catch (error) {
        console.error('Erro ao listar os membros:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


// Endpoint: Insere uma nova dúvida compartilhada
app.post('/v1/studyfy/duvidaCompartilhada', cors(), bodyParserJSON, async function(request, response) {
    try {
        // Recebe o content-type da requisição
        let contentType = request.headers['content-type'];
        
        // Recebe todos os dados encaminhados na requisição pelo body
        let dadosBody = request.body;

        console.log(dadosBody);
        
        
        // Encaminha os dados para a controller
        let resultDadosNovaDuvida = await controllerDuvidaCompartilhada.setInserirNovaDuvida(dadosBody, contentType);
        
        console.log(resultDadosNovaDuvida);
        
        // Define o status da resposta e envia os dados de volta
        response.status(resultDadosNovaDuvida.status_code);
        response.json(resultDadosNovaDuvida);
    } catch (error) {
        console.error('Erro ao inserir dúvida compartilhada:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


// server.js ou routes.js

app.get('/v1/studyfy/duvidasCompartilhada/:membroId', cors(), async function(request, response) {
    try {
        const membroId = parseInt(request.params.membroId);
        const resultadoDuvidas = await controllerDuvidaCompartilhada.getBuscarDuvidasPorMembro(membroId);

        if (resultadoDuvidas.length === 0) {
            return response.status(404).json({ message: 'Nenhuma dúvida encontrada para este membro.' });
        }

        response.status(200).json(resultadoDuvidas);
    } catch (error) {
        console.error('Erro ao buscar dúvidas compartilhadas:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


// Endpoint: Atualiza uma dúvida compartilhada pelo ID
app.put('/v1/studyfy/duvidaCompartilhada/:id', cors(), bodyParserJSON, async function(request, response) {
    try {
        let contentType = request.headers['content-type'];
        let dadosBody = request.body;
        let idDuvida = request.params.id;
        
        let dadosDuvida = await controllerDuvidaCompartilhada.setAtualizarDuvida(idDuvida, dadosBody, contentType);
        
        response.status(dadosDuvida.status_code || 200);
        response.json(dadosDuvida);
    } catch (error) {
        console.error('Erro ao atualizar dúvida compartilhada:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});


// Endpoint: Deleta um grupo de mentoria pelo ID
app.delete('/v1/studyfy/duvidaCompartilhada/:id', cors(), async function(request, response) {
    try {
        let idDuvidaCompartilhada = request.params.id;
        
        let dadosDuvida = await controllerDuvidaCompartilhada.setExcluirDuvidaCompartilhada( idDuvidaCompartilhada);
        
        response.status(dadosDuvida.status_code);
        response.json(dadosDuvida);
    } catch (error) {
        console.error('Erro ao excluir grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});

// Endpoint: Buscar as dúvidas compartilhadas de um grupo de mentoria pelo ID
app.get('/v1/studyfy/duvidaCompartilhada/grupo/:grupoId', cors(), async function(request, response) {
    try {
        // Pega o ID do grupo de mentoria da URL
        const grupoId = parseInt(request.params.grupoId);

        // Chama a função da controller para buscar as dúvidas do grupo de mentoria
        const resultadoDuvidas = await controllerDuvidaCompartilhada.getBuscarDuvidasPorGrupoMentoria(grupoId);

        // Verifica se encontrou as dúvidas
        if (resultadoDuvidas.status_code === 404) {
            return response.status(404).json({ message: 'Nenhuma dúvida encontrada para este grupo de mentoria.' });
        }

        // Retorna as dúvidas encontradas
        response.status(resultadoDuvidas.status_code).json(resultadoDuvidas);
    } catch (error) {
        console.error('Erro ao buscar dúvidas do grupo de mentoria:', error);
        response.status(500).json({ status_code: 500, message: 'Erro interno do servidor' });
    }
});



// --------------------   post para o login  --------------------- 

// Endpoint: Realiza o login do usuário
app.post('/v1/studyFy/login', cors(), bodyParserJSON, async function(request, response) {
    // Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    // Recebe todos os dados encaminhados na requisição pelo Body
    let dadosBody = request.body;

    // Encaminha os dados para a controller realizar o login
    let resultadoLogin = await controllerAluno.loginUsuario(dadosBody.email, dadosBody.senha);
    
    console.log(resultadoLogin);
    response.status(resultadoLogin.status_code);
    response.json(resultadoLogin);
});


// Endpoint: Realiza o login do usuário
app.post('/v1/studyFy/login-email', cors(), bodyParserJSON, async function(request, response) {
    // Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    // Recebe todos os dados encaminhados na requisição pelo Body
    let dadosBody = request.body;

    // Encaminha os dados para a controller realizar o login
    let resultadoLogin = await controllerAluno.loginUsuarioEmail(dadosBody.email);

    response.status(resultadoLogin.status_code);
    response.json(resultadoLogin);
});



// Endpoint: Recupera a senha do usuário pelo ID
app.post('/v1/studyFy/get-senha', cors(), bodyParserJSON, async function(request, response) {
    // Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    // Recebe todos os dados encaminhados na requisição pelo Body
    let dadosBody = request.body;

    // Verifica se o ID foi enviado
    if (!dadosBody.id) {
        return response.status(400).json({ status_code: 400, message: 'ID do aluno é necessário.' });
    }

    // Encaminha os dados para a controller recuperar a senha
    let resultadoSenha = await controllerAluno.getSenhaDoUsuario(dadosBody.id);

    response.status(resultadoSenha.status_code);
    response.json(resultadoSenha);
});




//       --------------------   CRUD RESPOSTAS DÚVIDA  ---------------------        //

// -> EndPoint: Retorna todos os dados de respostas do Banco de Dados
app.get('/v1/studyFy/respostas', cors(), async function(request, response) {
    // -> Chama a função da controller para retornar todas as respostas
    let dadosRespostas = await controllerRespostaDuvida.getListarRespostas();

    // -> Validação para verificar se existem dados a serem retornados
    response.status(dadosRespostas.status_code);
    response.json(dadosRespostas);
});

// // EndPoint: Retorna os dados de uma resposta pelo ID
app.get('/v1/studyFy/respostas/:id', cors(), async function(request, response) {
    // Recebe o ID da requisição
    let idResposta = request.params.id;

    // Encaminha o ID para a controller buscar a resposta
    let dadosResposta = await controllerRespostaDuvida.getBuscarRespostaId(idResposta);

    response.status(dadosResposta.status_code);
    response.json(dadosResposta);
});

// // EndPoint: Insere uma nova resposta
app.post('/v1/studyFy/respostas', cors(), bodyParserJSON, async function(request, response) {
    // Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    // Recebe todos os dados encaminhados na requisição pelo body
    let dadosBody = request.body;

    // Encaminha os dados para a controller enviar para o DAO
    let resultDadosNovaResposta = await controllerRespostaDuvida.setInserirNovaResposta(dadosBody, contentType);

    response.status(resultDadosNovaResposta.status_code);
    response.json(resultDadosNovaResposta);
});

// // EndPoint: Deleta uma resposta pelo ID
app.delete('/v1/studyFy/respostas/:id', cors(), async function(request, response) {
    let idResposta = request.params.id;

    let dadosResposta = await controllerRespostaDuvida.setExcluirResposta(idResposta);

    response.status(dadosResposta.status_code);
    response.json(dadosResposta);
});

// // EndPoint: Atualiza uma resposta pelo ID
app.put('/v1/studyFy/respostas/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idResposta = request.params.id;

    let dadosResposta = await controllerRespostaDuvida.setAtualizarResposta(idResposta, dadosBody, contentType);

    response.status(dadosResposta.status_code);
    response.json(dadosResposta);
});



//       --------------------   CRUD QUESTOES ---------------------        //

// EndPoint: Retorna todas as questões
app.get('/v1/studyfy/questoesGeral', cors(), async function(request, response) {
    let dadosQuestoes = await controllerQuestao.getListarTudoQuestao();
    response.status(dadosQuestoes.status_code);
    response.json(dadosQuestoes);
});


// EndPoint: Retorna todas as questões
app.get('/v1/studyfy/questoes', cors(), async function(request, response) {
    let dadosQuestoes = await controllerQuestao.getListarQuestoes();
    response.status(dadosQuestoes.status_code);
    response.json(dadosQuestoes);
});

// EndPoint: Retorna a questão pelo ID
app.get('/v1/studyfy/questao/:id', cors(), async function(request, response) {
    let idQuestao = request.params.id;
    let dadosQuestao = await controllerQuestao.getBuscarQuestaoId(idQuestao);
    response.status(dadosQuestao.status_code);
    response.json(dadosQuestao);
});

// EndPoint: Insere nova questão
app.post('/v1/studyfy/questoes', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosNovaQuestao = await controllerQuestao.setInserirNovaQuestao(dadosBody, contentType);
    response.status(resultDadosNovaQuestao.status_code);
    response.json(resultDadosNovaQuestao);
});

// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/questao/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idQuestao = request.params.id;
    let dadosQuestao = await controllerQuestao.setAtualizarQuestao(idQuestao, dadosBody, contentType);
    response.status(dadosQuestao.status_code);
    response.json(dadosQuestao);
});

// EndPoint: Deleta questão pelo ID
app.delete('/v1/studyfy/questao/:id', cors(), async function(request, response) {
    let idQuestao = request.params.id;
    let dadosQuestao = await controllerQuestao.setExcluirQuestao(idQuestao);
    response.status(dadosQuestao.status_code);
    response.json(dadosQuestao);
});



//       --------------------   CRUD ATIVIDADES GRUPO DE MENTORIA ---------------------        //


// Endpoint: Listar todas as atividades
app.get('/v1/studyfy/atividades', async (req, res) => {
    let resultado = await controllerAtividade.getListarAtividades();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar atividade por ID
app.get('/v1/studyfy/atividade/:id', async (req, res) => {
    let idAtividade = req.params.id;
    let resultado = await controllerAtividade.getBuscarAtividadeById(idAtividade);
    res.status(resultado.status_code).json(resultado);
});

app.post('/v1/studyfy/atividade', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosNovaAtividade = await controllerAtividade.setInserirNovaAtividade(dadosBody, contentType);
    response.status(resultDadosNovaAtividade.status_code);
    response.json(resultDadosNovaAtividade);
});

// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/atividade/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idAtividade = request.params.id;
    let dadosAtividade = await controllerAtividade.setAtualizarAtividade(idAtividade, dadosBody, contentType);
    response.status(dadosAtividade.status_code);
    response.json(dadosAtividade);
});

// EndPoint: Deleta questão pelo ID
app.delete('/v1/studyfy/atividades/:id', cors(), async function(request, response) {
    let idAtividade = request.params.id;
    let dadosAtividade = await controllerAtividade.setExcluirAtividade(idAtividade);
    response.status(dadosAtividade.status_code);
    response.json(dadosAtividade);
});





//       --------------------   CRUD ORDEM PALAVRA ---------------------        //

// Endpoint: Listar todas as ordens de palavra
app.get('/v1/studyfy/ordens-palavra', async (req, res) => {
    let resultado = await controllerOrdemPalavra.getListarOrdemPalavras();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar ordem de palavra por ID
app.get('/v1/studyfy/ordem-palavra/:id', async (req, res) => {
    let idOrdem = req.params.id;
    let resultado = await controllerOrdemPalavra.getBuscarOrdemPalavraById(idOrdem);
    res.status(resultado.status_code).json(resultado);
});

app.post('/v1/studyfy/ordem-palavra', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosNovaOrdem = await controllerOrdemPalavra.setInserirNovaOrdemPalavra(dadosBody, contentType);
    response.status(resultDadosNovaOrdem.status_code);
    response.json(resultDadosNovaOrdem);
});

// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/ordem-palavra/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idOrdem = request.params.id;
    let dadosOrdemPalavra = await controllerOrdemPalavra.setAtualizarOrdemPalavra(idOrdem, dadosBody, contentType);
    response.status(dadosOrdemPalavra.status_code);
    response.json(dadosOrdemPalavra);
});

// Endpoint: Deletar ordem de palavra pelo ID
app.delete('/v1/studyfy/ordem-palavra/:id', async (req, res) => {
    let idOrdem = req.params.id;
    let resultado = await controllerOrdemPalavra.setExcluirOrdemPalavra(idOrdem);
    res.status(resultado.status_code).json(resultado);
});





//       --------------------   CRUD RESPOSTAS LACUNAS ---------------------        //

// Endpoint: Listar todas as respostas de lacunas
app.get('/v1/studyfy/resposta-lacunas', async (req, res) => {
    let resultado = await controllerRespostaLacunas.getListarRespostasLacunas();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar resposta de lacuna por ID
app.get('/v1/studyfy/resposta-lacunas/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaLacunas.getBuscarRespostaLacunaById(idResposta);
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Inserir nova resposta de lacunas
app.post('/v1/studyfy/resposta-lacunas', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosLacunas = await controllerRespostaLacunas.setInserirNovaRespostaLacuna(dadosBody, contentType);
    response.status(resultDadosLacunas.status_code);
    response.json(resultDadosLacunas);
});

// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/resposta-lacunas/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idLacuna = request.params.id;
    let dadosRespostaLacuna = await controllerRespostaLacunas.setAtualizarRespostaLacuna(idLacuna, dadosBody, contentType);
    response.status(dadosRespostaLacuna.status_code);
    response.json(dadosRespostaLacuna);
});

// Endpoint: Deletar resposta de lacunas
app.delete('/v1/studyfy/resposta-lacunas/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaLacunas.setExcluirRespostaLacuna(idResposta);
    res.status(resultado.status_code).json(resultado);
});



//       --------------------   CRUD RESPOSTAS CORRESPONDENCIA ---------------------        //


// Endpoint: Listar todas as respostas de correspondência
app.get('/v1/studyfy/resposta-correspondencia', async (req, res) => {
    let resultado = await controllerRespostaCorrespondencia.getListarRespostasCorrespondencia();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar resposta de correspondência por ID
app.get('/v1/studyfy/resposta-correspondencia/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaCorrespondencia.getBuscarRespostaCorrespondenciaById(idResposta);
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Inserir nova resposta de lacunas
app.post('/v1/studyfy/resposta-correspondencia', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosCorrespondencia = await controllerRespostaCorrespondencia.setInserirNovaRespostaCorrespondencia(dadosBody, contentType);
    response.status(resultDadosCorrespondencia.status_code);
    response.json(resultDadosCorrespondencia);
});


// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/resposta-correspondencia/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idCorrespondencia = request.params.id;
    let dadosRespostaCorrespondencia = await controllerRespostaCorrespondencia.setAtualizarRespostaCorrespondencia(idCorrespondencia, dadosBody, contentType);
    response.status( dadosRespostaCorrespondencia.status_code);
    response.json( dadosRespostaCorrespondencia);
});


// Endpoint: Deletar resposta de correspondência
app.delete('/v1/studyfy/resposta-correspondencia/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaCorrespondencia.setExcluirRespostaCorrespondencia(idResposta);
    res.status(resultado.status_code).json(resultado);
});



//       --------------------   CRUD RESPOSTAS MULTIPLA ESCOLHA ---------------------        //


// Endpoint: Listar todas as respostas de correspondência
app.get('/v1/studyfy/resposta-multipla', async (req, res) => {
    let resultado = await controllerRespostaMultipla.getListarRespostasMultiplas();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar resposta de correspondência por ID
app.get('/v1/studyfy/resposta-multipla/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaMultipla.getBuscarRespostaMultiplasById(idResposta);
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Inserir nova resposta de lacunas
app.post('/v1/studyfy/resposta-multipla', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosMultipla = await controllerRespostaMultipla.setInserirNovaRespostaMultipla(dadosBody, contentType);
    response.status(resultDadosMultipla.status_code);
    response.json(resultDadosMultipla);
});


// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/resposta-multipla/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idMultipla = request.params.id;
    let dadosRespostaMultipla = await controllerRespostaMultipla.setAtualizarRespostaMultipla(idMultipla, dadosBody, contentType);
    response.status( dadosRespostaMultipla.status_code);
    response.json( dadosRespostaMultipla);
});


// Endpoint: Deletar resposta de correspondência
app.delete('/v1/studyfy/resposta-multipla/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaMultipla.setExcluirRespostaMultipla(idResposta);
    res.status(resultado.status_code).json(resultado);
});





//       --------------------   CRUD RESPOSTAS VERDADEIRO E FALSO ---------------------        //


// Endpoint: Listar todas as respostas de correspondência
app.get('/v1/studyfy/resposta-vf', async (req, res) => {
    let resultado = await controllerRespostaVerdadeiroFalso.getListarRespostasVF();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar resposta de correspondência por ID
app.get('/v1/studyfy/resposta-vf/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaVerdadeiroFalso.getBuscarRespostaVFById(idResposta);
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Inserir nova resposta de lacunas
app.post('/v1/studyfy/resposta-vf', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosVF = await controllerRespostaVerdadeiroFalso.setInserirNovaRespostaVF(dadosBody, contentType);
    response.status(resultDadosVF.status_code);
    response.json(resultDadosVF);
});


// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/resposta-vf/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idVF = request.params.id;
    let dadosRespostaVF = await controllerRespostaVerdadeiroFalso.setAtualizarRespostaVF(idVF, dadosBody, contentType);
    response.status( dadosRespostaVF.status_code);
    response.json( dadosRespostaVF);
});


// Endpoint: Deletar resposta de correspondência
app.delete('/v1/studyfy/resposta-vf/:id', async (req, res) => {
    let idResposta = req.params.id;
    let resultado = await controllerRespostaVerdadeiroFalso.setExcluirRespostaVF(idResposta);
    res.status(resultado.status_code).json(resultado);
});





// --------------------   CRUD SALAS --------------------- //

// Endpoint: Listar todas as salas
app.get('/v1/studyfy/salas', async (req, res) => {
    let resultado = await controllerSalas.getSalas();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar sala por ID
app.get('/v1/studyfy/salas/:id', async (req, res) => {
    let idSala = req.params.id;
    let resultado = await controllerSalas.getBuscarSalaId(idSala);
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Inserir nova sala
app.post('/v1/studyfy/sala', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosSala = await controllerSalas.setInserirNovaSala(dadosBody, contentType);
    response.status(resultDadosSala.status_code).json(resultDadosSala);
});

// Endpoint: Atualizar sala pelo ID
app.put('/v1/studyfy/sala/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idSala = request.params.id;
    let dadosRespostasSala = await controllerSalas.setAtualizarSala(idSala, dadosBody, contentType);
    response.status(dadosRespostasSala.status_code).json(dadosRespostasSala);
});

// Endpoint: Deletar sala
app.delete('/v1/studyfy/sala/:id', async (req, res) => {
    let idSala = req.params.id;
    let resultado = await controllerSalas.setExcluirSala(idSala);
    res.status(resultado.status_code).json(resultado);
});



//       --------------------   SELECT ALUNO SALA  ---------------------        //


// Endpoint: Listar todas as respostas de correspondência
app.get('/v1/studyfy/salas-Aluno/:salaId', async (req, res) => {
    try {
        const { salaId } = req.params; // Pega o ID da sala dos parâmetros da rota
        let resultado = await controllerAluno.getListarAlunosPorSala(salaId); // Chama a função da controller
        res.status(resultado.status_code).json(resultado); // Retorna o resultado
    } catch (error) {
        console.log(error);
        res.status(500).json({ status_code: 500, message: 'Erro interno do servidor.' });
    }
});





//       --------------------   CRUD RANK ---------------------        //


// Endpoint: Listar todas as respostas de correspondência
app.get('/v1/studyfy/rank', async (req, res) => {
    let resultado = await controllerRank.getRank();
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Buscar resposta de correspondência por ID
app.get('/v1/studyfy/rank/:id', async (req, res) => {
    let idRank = req.params.id;
    let resultado = await controllerRank.getBuscarRankId(idRank);
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Inserir nova resposta de lacunas
app.post('/v1/studyfy/rank', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosRank = await controllerRank.setInserirNovoRank(dadosBody, contentType);
    response.status(resultDadosRank.status_code);
    response.json(resultDadosRank);
});


// EndPoint: Atualiza questão pelo ID
app.put('/v1/studyfy/rank/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idRank = request.params.id;
    let dadosRank = await controllerRank.setAtualizarRank(idRank, dadosBody, contentType);
    response.status(dadosRank.status_code);
    response.json( dadosRank);
});


// Endpoint: Deletar resposta de correspondência
app.delete('/v1/studyfy/rank/:id', async (req, res) => {
    let idRank = req.params.id;
    let resultado = await controllerRank.setExcluirRank(idRank);
    res.status(resultado.status_code).json(resultado);
});




// --------------------   CRUD TEMPORADAS --------------------- //

// Endpoint: Listar todas as temporadas
app.get('/v1/studyfy/temporadas', async (req, res) => {
    let resultado = await controllerTemporadas.getTemporadas();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar temporada por ID
app.get('/v1/studyfy/temporadas/:id', async (req, res) => {
    let idTemporada = req.params.id;
    let resultado = await controllerTemporadas.getBuscarTemporadaId(idTemporada);
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Inserir nova temporada
app.post('/v1/studyfy/temporada', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosTemporada = await controllerTemporadas.setInserirNovaTemporada(dadosBody, contentType);
    response.status(resultDadosTemporada.status_code).json(resultDadosTemporada);
});

// Endpoint: Atualizar temporada pelo ID
app.put('/v1/studyfy/temporada/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idTemporada = request.params.id;
    let dadosTemporadaAtualizada = await controllerTemporadas.setAtualizarTemporada(idTemporada, dadosBody, contentType);
    response.status(dadosTemporadaAtualizada.status_code).json(dadosTemporadaAtualizada);
});

// Endpoint: Deletar temporada
app.delete('/v1/studyfy/temporada/:id', async (req, res) => {
    let idTemporada = req.params.id;
    let resultado = await controllerTemporadas.setExcluirTemporada(idTemporada);
    res.status(resultado.status_code).json(resultado);
});


app.post('/v2/studyfy/temporadas', async (req, res) => {
    let resultado = await controllerTemporadas.setInserirNovaTemporada2();
    res.status(resultado.status_code).json(resultado);
});






// --------------------   CRUD DE EMBLEMA  --------------------- //

// Endpoint: Listar todas as salas
app.get('/v1/studyfy/emblema', async (req, res) => {
    let resultado = await controllerEmblema.getEmblema();
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Buscar sala por ID
app.get('/v1/studyfy/emblema/:id', async (req, res) => {
    let idEmblema = req.params.id;
    let resultado = await controllerEmblema.getBuscarEmblemaId(idEmblema);
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Inserir nova sala
app.post('/v1/studyfy/emblema', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosEmblema = await controllerEmblema.setInserirNovoEmblema(dadosBody, contentType);
    response.status(resultDadosEmblema.status_code).json(resultDadosEmblema);
});

// Endpoint: Atualizar sala pelo ID
app.put('/v1/studyfy/emblema/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idEmblema = request.params.id;
    let dadosRespostasEmblema = await controllerEmblema.setAtualizarEmblema(idEmblema, dadosBody, contentType);
    response.status(dadosRespostasEmblema.status_code).json(dadosRespostasEmblema);
});

// Endpoint: Deletar sala
app.delete('/v1/studyfy/emblema/:id', async (req, res) => {
    let idEmblema = req.params.id;
    let resultado = await controllerEmblema.setExcluirEmblema(idEmblema);
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Listar os emblemas conquistados por um aluno
app.get('/v1/studyfy/emblema/conquistados/:idAluno', async (req, res) => {
    const idAluno = req.params.idAluno;
    let resultado = await controllerEmblema.getListarEmblemasAluno(idAluno);
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Listar os emblemas não conquistados por um aluno
app.get('/v1/studyfy/emblema/nao-conquistados/:idAluno', async (req, res) => {
    const idAluno = req.params.idAluno;
    let resultado = await controllerEmblema.getListarEmblemasNaoConquistados(idAluno);
    res.status(resultado.status_code).json(resultado);
});





// --------------------   CRUD DE NÍVEL EMBLEMA  --------------------- //

// Endpoint: Listar todas as salas
app.get('/v1/studyfy/nivel-emblema', async (req, res) => {
    let resultado = await controllerNivelEmblema.getNivelEmblema();
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Buscar sala por ID
app.get('/v1/studyfy/nivel-emblema/:id', async (req, res) => {
    let idNivelEmblema = req.params.id;
    let resultado = await controllerNivelEmblema.getBuscarNivelEmblemaId(idNivelEmblema);
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Inserir nova sala
app.post('/v1/studyfy/nivel-emblema', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosNivelEmblema = await controllerNivelEmblema.setInserirNovoNivelEmblema(dadosBody, contentType);
    response.status(resultDadosNivelEmblema.status_code).json(resultDadosNivelEmblema);
});

// Endpoint: Atualizar sala pelo ID
app.put('/v1/studyfy/nivel-emblema/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idNivelEmblema = request.params.id;
    let dadosRespostasNivelEmblema = await controllerNivelEmblema.setAtualizarNivelEmblema(idNivelEmblema, dadosBody, contentType);
    response.status(dadosRespostasNivelEmblema.status_code).json(dadosRespostasNivelEmblema);
});

// Endpoint: Deletar sala
app.delete('/v1/studyfy/nivel-emblema/:id', async (req, res) => {
    let idNivelEmblema = req.params.id;
    let resultado = await controllerNivelEmblema.setExcluirNivelEmblema(idNivelEmblema);
    res.status(resultado.status_code).json(resultado);
});






// --------------------   CRUD DE NÍVEL ALUNO EMBLEMA  --------------------- //

// Endpoint: Listar todas as salas
app.get('/v1/studyfy/aluno-emblema', async (req, res) => {
    let resultado = await controllerAlunoEmblema.getAlunoEmblema();
    res.status(resultado.status_code).json(resultado);
});


// Endpoint: Buscar sala por ID
app.get('/v1/studyfy/aluno-emblema/:id', async (req, res) => {
    let idAlunoEmblema = req.params.id;
    let resultado = await controllerAlunoEmblema.getBuscarAlunoEmblemaId(idAlunoEmblema);
    res.status(resultado.status_code).json(resultado);
});

// Endpoint: Inserir nova sala
app.post('/v1/studyfy/aluno-emblema', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let resultDadosAlunoEmblema = await controllerAlunoEmblema.setInserirNovoAlunoEmblema(dadosBody, contentType);
    response.status(resultDadosAlunoEmblema.status_code).json(resultDadosAlunoEmblema);
});

// Endpoint: Atualizar sala pelo ID
app.put('/v1/studyfy/aluno-emblema/:id', cors(), bodyParserJSON, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let idAlunoEmblema = request.params.id;
    let dadosRespostasAlunoEmblema = await controllerAlunoEmblema.setAtualizarAlunoEmblema(idAlunoEmblema, dadosBody, contentType);
    response.status(dadosRespostasAlunoEmblema.status_code).json(dadosRespostasAlunoEmblema);
});

// Endpoint: Deletar sala
app.delete('/v1/studyfy/aluno-emblema/:id', async (req, res) => {
    let idAlunoEmblema = req.params.id;
    let resultado = await controllerAlunoEmblema.setExcluirAlunoEmblema(idAlunoEmblema);
    res.status(resultado.status_code).json(resultado);
});

//adicionar

app.get('/v1/studyfy/imagens/grupo-mentoria', async (req, res) => {
    try {

        let imagens = await controllerImgsGrupoMentoria.getListarImgs()
        res.json(imagens); // Retorna os resultados como JSON
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        res.status(500).json({ error: 'Erro ao buscar imagens' });
    }
});

// --------------------   CRUD DE CADERNO VIRTUAL  --------------------- //

app.post('/v1/studyFy/cadernoVirtual', cors(), bodyParserJSON, async function(request, response){

    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Recebe todos os dados encaminhados na requisição pelo Body
    let dadosBody = request.body

    //Encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoAluno = await controllerCadernoVirtual.setInserirNovaNota(dadosBody, contentType)
    console.log(resultDadosNovoAluno);
    response.status(resultDadosNovoAluno.status_code)
    response.json(resultDadosNovoAluno)
})

app.get('/v1/studyFy/cadernoVirtual/:idAluno', cors(), async function(request, response) {

    console.log('oiiioii');
    
    let idAluno = request.params.idAluno;

    let resultDados = await controllerCadernoVirtual.getNotasAluno(idAluno);
    response.status(resultDados.status_code);
    response.json(resultDados);
});

app.delete('/v1/studyFy/cadernoVirtual/:idAluno/:idNota', cors(), async function(request, response) {
    let idAluno = request.params.idAluno;
    let idNota = request.params.idNota;

    let resultDelete = await controllerCadernoVirtual.deleteNota(idAluno, idNota);
    response.status(resultDelete.status_code);
    response.json(resultDelete);
});

app.put('/v1/studyFy/cadernoVirtual/:idAluno/:idNota', cors(), bodyParserJSON, async function(request, response) {
    let idAluno = request.params.idAluno;
    let idNota = request.params.idNota;
    let dadosBody = request.body;

    let resultUpdate = await controllerCadernoVirtual.updateNota(idAluno, idNota, dadosBody);
    response.status(resultUpdate.status_code);
    response.json(resultUpdate);
});







app.listen('8080', function(){
    console.log('API funcionando!!')
})