const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { result, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        id: id,
        result: result,
        suggestion: suggestion,
        createdAt: createdAt,
    }

    const response = h.response({
        status: "success",
        message: "Model is predicted successfully",
        data,
    })
    await storeData(id, data);
    response.code(201);
    return response;
}

async function getHistoriesHandler(request, h){
    const firestore = new Firestore();
    const historyCollection = firestore.collection('predictions'); 

    try {
        const historiesData = await historyCollection.get();
        const histories = [];

        historiesData.forEach(doc => {
            const data = doc.data();
            histories.push({
                id: data.id,
                history: {
                    result: data.result,
                    createdAt: data.createdAt,
                    suggestion: data.suggestion,
                    id: data.id,
                }
            });
        });

        const response = h.response({
            status: "success",
            data: histories,
        });

        return response;

    } catch (error) {
        const response = h.response({
            status: "error",
            message: error.message,
        });
        response.code(500);
        return response;
    }
}

module.exports = [postPredictHandler, getHistoriesHandler];