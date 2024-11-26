/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 2.0
*******************************************************/

// Importa as mensagens e os DAOs
const message = require('./modulo/config.js');
const alunoDAO = require('../model/aluno.js');
const materiaDAO = require('../model/materia.js');
const mentorDAO = require ('../model/mentor.js')
const dns = require('dns').promises


// Função auxiliar para validar a data de nascimento
function isValidDate(dateString) {

    // Verifica se a data está no formato YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }

     // Verifica se ta em ano,mes e dia
    const [year, month, day] = dateString.split('-').map(Number);

    // Verifica se o ano é válido ou seja antes de 1900 vai dar
    if (year < 1900) {
        return false;
    }

    // Verifica se o mês é válido
    if (month < 1 || month > 12) {
        return false;
    }

    // Verifica se o dia é válido
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return false;
    }

    return true;
}

function converterData(data) {

    const partes = data.split('-');
      try{
      if (partes.length === 3) {
    
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];
          
        const dataFormatada = `${ano}-${mes}-${dia}`
          return dataFormatada;
        } else {
          return false
        }
    }catch(error){
        console.log(error);
        return false
    }
      }

const getListarAlunosMentores = async function(id) {
    try {
        // Criar o objeto JSON
        let alunosMentoresJSON = {};
        
        // Chamar a função do DAO para retornar os dados da tabela de produtos
        
        let dadosAlunosMentores = await mentorDAO.selectAlunoMentorById(id);

        // Validação para verificar se existem dados 
        if (dadosAlunosMentores) {
            // Criar o JSON para devolver para o APP
            alunosMentoresJSON.mentores = dadosAlunosMentores;
            alunosMentoresJSON.quantidade = dadosAlunosMentores.length;
            alunosMentoresJSON.status_code = 200;
            return alunosMentoresJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        } 
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
}

// Função para formatar a data
function formatarData(data) {
    if (!data) return null; // Se data for falsy, retorna null

    // Verifica se data é um objeto Date
    if (data instanceof Date) {
        return data.toISOString().split('T')[0]; // Converte para string no formato ISO
    }

    // Se data for uma string, continua o processamento
    if (typeof data === 'string') {
        const partes = data.split('T')[0]; // Separa a data da hora
        return partes; // Retorna apenas a parte da data
    }

    return null; // Se não for string nem objeto Date, retorna null
}



// Função para listar alunos
// Função para listar alunos
const getListarAluno = async function() {
    try {
        let alunoJSON = {};
        let dadosAlunos = await alunoDAO.selectAllAlunos();

        if (dadosAlunos) {
            for (let i = 0; i < dadosAlunos.length; i++) {
                console.log(dadosAlunos[i]);

                let materiasAluno = await materiaDAO.selectMateriaByIdAluno(dadosAlunos[i].id);
                let listaMateriasAluno = materiasAluno;

                // Adicione um log para verificar o formato da data
                console.log('Data original:', dadosAlunos[i].data_nascimento);
                
                // Formatar a data de nascimento
                dadosAlunos[i].data_nascimento = formatarData(dadosAlunos[i].data_nascimento);
                dadosAlunos[i].materias = listaMateriasAluno;
            }
            
            alunoJSON.aluno = dadosAlunos;
            alunoJSON.quantidade = dadosAlunos.length;
            alunoJSON.status_code = 200;
            return alunoJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const getAlunoDetails = async (idAluno) => {
    try {
        // Chama o model para buscar os dados do aluno pelo ID
        let alunoData = await alunoDAO.selectAlunoDetailsbyID(idAluno);

        // Verifica se a consulta foi bem-sucedida
        if (alunoData.status_code === 200) {
            alunoData.aluno.data_criacao_conta = formatarData(alunoData.aluno.data_criacao_conta)
            
            return alunoData; // Retorna os dados do aluno com status 200
        } else {
            return alunoData; // Retorna erro, como aluno não encontrado ou erro no servidor
        }
    } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        return { message: "Erro ao buscar aluno", status_code: 500 };
    }
};


const loginUsuario = async function(email, senha) {
    try {
        let usuarioJSON = {};
        let dadosUsuario = await alunoDAO.selectUsuarioByEmailESenha(email, senha);

        if (dadosUsuario.length === 0) {
            return { status_code: 400, message: 'Usuário não encontrado ou senha incorreta' };
        }

        // Se tudo estiver correto, retorna o usuário e uma mensagem de sucesso
        usuarioJSON.dadosUsuario = dadosUsuario[0];
        usuarioJSON.status_code = 200;
        usuarioJSON.message = 'Login bem-sucedido';
        return usuarioJSON;
    } catch (error) {
        console.log(error);
        return { status_code: 500, message: 'Erro interno do servidor' };
    }
};

const loginUsuarioEmail = async function(email,id_aluno) {
    try {
        let usuarioJSON = {};
        let dadosUsuario = await alunoDAO.selectUsuarioByEmail(email, id_aluno);

        if (dadosUsuario.length === 0) {
            return { status_code: 400, message: 'Usuário não encontrado ou senha incorreta' };
        }

        console.log(dadosUsuario);
        
        // Se tudo estiver correto, retorna o usuário e uma mensagem de sucesso
        usuarioJSON.usuario_id = dadosUsuario[0].id;
        usuarioJSON.status_code = 200;
        usuarioJSON.message = 'Login bem-sucedido';
        return usuarioJSON;
    } catch (error) {
        console.log(error);
        return { status_code: 500, message: 'Erro interno do servidor' };
    }
};

// Função para buscar aluno por ID
const getBuscarAlunoId = async function(id) {
    try {
        // Chama o model para buscar os dados do aluno pelo ID
        let alunoData = await alunoDAO.selectAlunobyID(id);

        // Verifica se a consulta foi bem-sucedida
        if (alunoData.status_code === 200) {
            alunoData.aluno.data_criacao_conta = formatarData(alunoData.aluno.data_criacao_conta)
            
            return alunoData; // Retorna os dados do aluno com status 200
        } else {
            return alunoData; // Retorna erro, como aluno não encontrado ou erro no servidor
        }
    } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        return { message: "Erro ao buscar aluno", status_code: 500 };
    }
};


// Atualizar a função de inserção de aluno para chamar a nova função
const setInserirNovoAluno = async function(dadosAluno, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let alunoJSON = {};

            // Validação de campos (omitida por brevidade)

            const dominioValido = await verificaDominioExiste(dadosAluno.email)

            if(dominioValido == false){
                return message.ERROR_EMAIL_VALIDATE
            } else {

                let novoAluno = await alunoDAO.insertAluno(dadosAluno);
            
                if (novoAluno) {
                    let lastId = await alunoDAO.lastIDAluno();
                    dadosAluno.id = lastId[0].id;
    
                    console.log('aaaaaaaaaaaaaa');
    
                    console.log(dadosAluno.id);
                    
                    // Chama a função para adicionar o aluno à sala
                    const alunoAdicionadoASala = await alunoDAO.adicionarAlunoASala(dadosAluno.id);
    
                    console.log('cccccccc');
                    
                    
                    if (!alunoAdicionadoASala) {
                        return message.ERROR_INTERNAL_SERVER_DB; // 500
                    }
    
                    console.log('bbbbbbbbbb');
                    
    
                    alunoJSON.aluno = dadosAluno;
                    alunoJSON.status = message.SUCCESS_CREATED_ITEM.status;
                    alunoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code;
                    alunoJSON.message = message.SUCCESS_CREATED_ITEM.message;
    
                    return alunoJSON; // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // 500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE; // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

// Função para excluir aluno
const setExcluirAluno = async function(id) {
    try {
        let idAluno = id;

        if (idAluno === '' || idAluno === undefined || isNaN(idAluno)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let alunoDeletado = await alunoDAO.deleteAluno(idAluno);

            if (alunoDeletado) {
                return message.SUCCESS_DELETED_ITEM;
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

// Função para atualizar aluno
const setAtualizarAluno = async function(id, dadosAluno, contentType) {
    try {
        let idAluno = id;

        const dominioValido = await verificaDominioExiste(dadosAluno.email)
        if(dominioValido == false){
            return message.ERROR_EMAIL_VALIDATE
        } else {
                    // Validação do ID
        if (idAluno === '' || idAluno === undefined || isNaN(idAluno) || idAluno === null) {
            return message.ERROR_INVALID_ID;
        } else {
            // Validação do tipo de conteúdo
            if (String(contentType).toLowerCase() === 'application/json') {
                let updateAlunoJSON = {};
                
                // Validação dos campos do aluno
                if (
                    dadosAluno.nome === '' || dadosAluno.nome === undefined || dadosAluno.nome === null || dadosAluno.nome.length > 90 ||
                    dadosAluno.email === '' || dadosAluno.email === undefined || dadosAluno.email === null || dadosAluno.email.length > 256 ||
                    dadosAluno.telefone === '' || dadosAluno.telefone === undefined || dadosAluno.telefone === null || dadosAluno.telefone.length > 20 ||
                    dadosAluno.senha === '' || dadosAluno.senha === undefined || dadosAluno.senha === null || dadosAluno.senha.length > 25 ||
                    dadosAluno.serie === '' || dadosAluno.serie === undefined || dadosAluno.serie === null || dadosAluno.serie.length > 20 ||
                    dadosAluno.foto === '' || dadosAluno.foto === undefined || dadosAluno.foto === null || dadosAluno.foto.length > 256 ||
                    dadosAluno.data_nascimento === '' || dadosAluno.data_nascimento === undefined || dadosAluno.data_nascimento === null ||
                    !isValidDate(dadosAluno.data_nascimento) ||
                    (dadosAluno.pontos !== undefined && (isNaN(dadosAluno.pontos) || dadosAluno.pontos < 0)) || // Validar pontos
                    (dadosAluno.id_rank !== undefined && (isNaN(dadosAluno.id_rank) || dadosAluno.id_rank <= 0)) // Validar id_rank
                ) {
                    return message.ERROR_REQUIRED_FIELDS;
                } else {
                    let alunoById = await alunoDAO.selectAlunobyID(id);

                    // Verifica se o aluno existe
                    if (alunoById.length > 0) {
                        let updateAluno = await alunoDAO.updateAluno(id, dadosAluno);
                        
                        if (updateAluno) {
                            updateAlunoJSON.aluno = {
                                ...dadosAluno, // Inclui todos os dados do aluno
                                id: id, // Adiciona o ID do aluno atualizado
                            };
                            updateAlunoJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                            updateAlunoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code;
                            updateAlunoJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                            
                            return updateAlunoJSON; // Retorna os dados do aluno atualizado
                        } else {
                            return message.ERROR_INTERNAL_SERVER_DB; // 500
                        }
                    } else {
                        return message.ERROR_NOT_FOUND; // 404
                    }
                }
            } else {
                return message.ERROR_CONTENT_TYPE; // 415
            }
        }
        }
    } catch (error) {
        console.log('Erro ao atualizar aluno:', error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};


const getListarAlunosPorSala = async function(salaId) {
    try {
        // Criar o objeto JSON
        let alunosJSON = {};

        // Chamar a função do DAO para retornar os dados dos alunos
        let dadosAlunos = await alunoDAO.selectAlunosRank(salaId);

        // Validação para verificar se existem dados 
        if (dadosAlunos) {
            // Criar o JSON para devolver para o APP
            const alunosConvertidos = dadosAlunos.map(aluno => {
                return {
                    id_aluno: aluno.id_aluno.toString(), // Converte o BigInt para String
                    nome_aluno: aluno.nome_aluno,
                    pontos_aluno: aluno.pontos_aluno.toString(), // Converte o BigInt para String
                    posicao: aluno.posicao.toString() // Converte o BigInt para String
                };
            });

            alunosJSON.alunos = alunosConvertidos;
            alunosJSON.quantidade = alunosConvertidos.length;
            alunosJSON.status_code = 200;
            return alunosJSON;
        } else {
            return { status_code: 404, message: 'Nenhum aluno encontrado.' };
        }
    } catch (error) {
        console.log(error);
        return { status_code: 500, message: 'Erro interno do servidor.' };
    }
};


const setAtualizarSenhaAluno = async function(id, dados, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            const novaSenha = dados.novaSenha; // Certifique-se de que você está acessando a senha corretamente
            let updatedSenha = await alunoDAO.updateSenhaAluno(id, novaSenha);
            if (updatedSenha) {
                return { message: "Senha atualizada com sucesso!", status: message.SUCCESS_UPDATED_ITEM.status, status_code: message.SUCCESS_UPDATED_ITEM.status_code };
            } else {
                return message.ERROR_INTERNAL_SERVER_DB;
            }
        } else {
            return message.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const verificaDominioExiste = async (email) => {
    const dominio = email.split('@')[1];

    try {
        const registrosMx = await dns.resolveMx(dominio);
        return registrosMx.length > 0; // Retorna true se o domínio existe
    } catch (error) {
        console.error(`Erro ao verificar o domínio: ${error.message}`);
        return false; // O domínio pode não existir
    }
};

const getSenhaDoUsuario = async function(id) {
    try {
        let senhaJSON = {};
        let dadosUsuario = await alunoDAO.selectSenhaById(id);

        if (!dadosUsuario || dadosUsuario.length === 0) {
            return { status_code: 404, message: 'Aluno não encontrado' };
        }

        console.log(dadosUsuario);
        
        // Se tudo estiver correto, retorna a senha do usuário
        senhaJSON.senha = dadosUsuario[0].senha;
        senhaJSON.status_code = 200;
        senhaJSON.message = 'Senha recuperada com sucesso';
        return senhaJSON;
    } catch (error) {
        console.log(error);
        return { status_code: 500, message: 'Erro interno do servidor' };
    }
};




// Exporta as funções
module.exports = {
    getAlunoDetails,
    getListarAluno,
    getBuscarAlunoId,
    setInserirNovoAluno,
    setAtualizarAluno,
    setExcluirAluno,
    getListarAlunosMentores,
    converterData,
    loginUsuario,
    getListarAlunosPorSala,
    setAtualizarSenhaAluno,
    loginUsuarioEmail,
    getSenhaDoUsuario
};
