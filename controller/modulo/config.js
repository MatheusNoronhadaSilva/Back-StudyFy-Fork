

 
/************************* MENSAGEM DE ERRO DO PROJETO **********************************/
const ERROR_INVALID_ID = {status: false, status_code: 400, message: 'O dado encaminhado na requisição não é valido!!'}

const ERROR_NOT_FOUND = {status: false, status_code: 404, message: 'Não foi encontrado nenhum item!!'}

const ERROR_INTERNAL_SERVER_DB = {status: false, status_code: 500, message: 'Não foi possivel processar a requisição, devido ao um erro no acesso ao banco de dados. Contate o administrador da API!!'}

const ERROR_REQUIRED_FIELDS = {status: false, status_code: 400, message: 'Existem campos requeridos e não foram preenchidos, ou não atendem aos critérios de digitação!!'}

const ERROR_CONTENT_TYPE  = {status: false, status_code: 415, message: 'O content-type encaminhado na requisição não é suportado pelo servidor. Deve-se encaminhar apenas requisições com aplication/json'}

const ERROR_INTERNAL_SERVER= {status: false, status_code: 500, message: 'Não foi possivel processar a requisição, devido ao um erro na camada de negócio/controle da aplicação. Contate o administrador da API!!'}

const ERROR_DUPLICATE_EMAIL= {status: false, status_code: 409, message: 'Houve um erro ao fazer o cadastro, talvez o email inserido já esteja em uso, tente com outro'}

const ERROR_EMAIL_VALIDATE = {status: false, status_code: 400, message: 'O domínio do email não existe'}


/************************* MENSAGEM SESUCESSO DO PROJETO **********************************/
const SUCESS_EMAIL_VALIDATE = {status: true, status_code: 201, message: 'O domínio deste email existe'}

const SUCCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'Item criado com sucesso!!'}

const SUCCESS_DELETED_ITEM = {status: true, status_code: 200, message: 'Item excluído com sucesso!!'}

const SUCCESS_UPDATED_ITEM = {status: true, status_code: 200, message: 'Item Atualizado com sucesso!!'}

const SUCCESS_REQUEST = {status: true, status_code: 200, message: 'Coleta de dados com sucesso!!'}


module.exports = {
ERROR_EMAIL_VALIDATE,
ERROR_DUPLICATE_EMAIL,
ERROR_INVALID_ID,
ERROR_NOT_FOUND,
ERROR_INTERNAL_SERVER_DB,
ERROR_REQUIRED_FIELDS,
SUCCESS_CREATED_ITEM,
ERROR_CONTENT_TYPE,
ERROR_INTERNAL_SERVER,
SUCCESS_DELETED_ITEM,
SUCCESS_UPDATED_ITEM,
SUCCESS_REQUEST
}
