/*******************************************************
 * DATA: 26/11/2024
 * Autor: Matheus Noronha
 * Versão: 1.0
*******************************************************/

const message = require('./modulo/config.js');
const SerieDAO = require('../model/serie');

const getSeries = async function () {
    try {
        let seriesJSON = {};
        let dadosSeries = await SerieDAO.selectSeries();
        
        if (dadosSeries) {

            seriesJSON.series = dadosSeries;
            seriesJSON.quantidade = dadosSeries.length;
            seriesJSON.status_code = 200;
            return seriesJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const getSerieAlunoESeries = async function (idAluno) {
    try {
        let seriesJSON = {};
        let dadosSeriesAluno = await SerieDAO.selectSerieAluno(idAluno);
        
        if (dadosSeriesAluno) {

            let dadosSeries = await SerieDAO.selectSeries();

            if(dadosSeries) {

                seriesJSON.serieAluno = dadosSeriesAluno;
                seriesJSON.series = dadosSeries
                seriesJSON.series.quantidade = dadosSeries.length;
                seriesJSON.status_code = 200;
                
                return seriesJSON;

            }
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

module.exports = {
    getSerieAlunoESeries,
    getSeries
};