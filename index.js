let config = {
    host: 'http://localhost:3000'
};

export default class API {

    static call(method, data, requestType = 'post', headers = {}){
        const config = API.config ? API.config : config;

        function status(response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function json(response) {
            return response.json()
        }

        let _body = '';
        if(typeof data == 'object'){
            for(let key in data){
                if(data.hasOwnProperty(key)) {
                    let value = data[key];
                    if(typeof value == 'object'){
                        value = JSON.stringify(value);
                    }
                    _body += (_body.length ? '&' : '') + key + '=' + value;
                }
            }
        } else {
            _body = data;
        }

        if(typeof headers === 'object') {
            headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        }

        let getRequestStr = '';
        if(requestType === 'get' && _body.length > 0) {
            getRequestStr = `?${_body}`;
        }

        return fetch(`${config.host}/${method}/${getRequestStr}`,{
            method: requestType,
            headers,
            body: _body
        })
            .then(status)
            .then(json)
            .catch(error => {
                throw error;
            });
    }

    static get(request, params = {}, headers = {}) {
        return API.call(request, params, 'get', headers);
    }

    static post(request, params = {}, headers = {}) {
        return API.call(request, params, 'post', headers);
    }

    static delete(request, headers = {}) {
        return API.call(request, null, 'delete', headers);
    }


    static filesUpload(method, files, bodyParams){

        let config = API.config ? API.config : config;

        if(!files) files = [];

        if(typeof files.map != 'function'){
            files = [files];
        }


        function status(response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }

        function json(response) {
            return response.json()
        }

        var data = new FormData();

        files.map((file) => {
            data.append('file', file);
        });

        if(typeof bodyParams == 'object'){
            Object.keys(bodyParams).forEach(key => {
                data.append(key, bodyParams[key]);
            });
        }

        return fetch(config.host+'/'+method+'/',{
            method: 'post',
            body: data
        })
            .then(status)
            .then(json)
            .catch(function(error) {
                console.log('Request failed', error);
            });

    }
    
}