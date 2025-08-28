const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.status(200).json({ status: "success", message: "Keepalive received (POST)" });
});


module.exports = router;