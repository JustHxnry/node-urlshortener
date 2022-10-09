const dbmgr = require('./dbmanager');
const basicAuth = require('express-basic-auth');
const validUrl = require('valid-url');

function authorizer(username, password) {
    const userMatches = basicAuth.safeCompare(username, process.env.X_USER);
    const passwordMatches = basicAuth.safeCompare(password, process.env.X_PASSWORD);

    return userMatches & passwordMatches;
}

module.exports = async(router) => {
    
    router.get('/', (req, res) => {

        return res.status(400).json({
            code: 400,
            status: "Bad Request",
            description: "Short ID must contain at least 3 characters",
            error_code: "ERR_UNDER_3_CHAR",
            url: req.url,
            date: new Date()
        });

    });

    router.get('/api', basicAuth({
        authorizer,
        challenge: true
    }), (req, res) => {

        var result = dbmgr.getAll();

        return res.status(200).json(result);

    });

    router.get('/:id', (req, res) => {

        var { id } = req.params;

        if (id.length < 3) return res.status(400).json({
            code: 400,
            status: "Bad Request",
            description: "Short ID must contain at least 3 characters",
            error_code: "ERR_UNDER_3_CHAR",
            url: req.url,
            date: new Date()
        });

        var data = dbmgr.getUrl({ id });
        if (data == null) return res.status(404).json({
            code: 404,
            status: "Not Found",
            description: "Short ID does not exist",
            error_code: "ERR_ID_NOT_FOUND",
            url: req.url,
            date: new Date()
        });

        return res.status(200).redirect(data.longUrl);

    });

    router.post('/api', (req, res) => {

        var { longUrl } = req.body;

        if (longUrl == null && !longUrl) return res.status(400).json({
            code: 400,
            status: "Bad Request",
            description: "No 'longUrl' body parameter was detected",
            error_code: "ERR_URL_NO_PARAM",
            url: req.url,
            date: new Date()
        });

        if (!validUrl.isUri(longUrl)) return res.status(400).json({
            code: 400,
            status: "Bad Request",
            description: "Specified URL is not valid uri",
            error_code: "ERR_URL_NOT_VALID",
            url: req.url,
            date: new Date()
        });

        var result = dbmgr.addUrl(longUrl);

        if (result == null || result == undefined) return res.status(500).json({
            code: 500,
            status: "Internal Server Error",
            description: "Shorted URL was not created",
            error_code: "ERR_ID_NOT_CREATED",
            url: req.url,
            date: new Date()
        });

        return res.status(201).json(result);

    });

    router.delete('/api/:id', basicAuth({
        authorizer,
        challenge: true
    }), (req, res) => {

        const { id } = req.params;

        var result = dbmgr.deleteUrl(id);

        return res.status(200).json(result);

    });

};