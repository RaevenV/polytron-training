//HAPUS CONTROLLER INI JIKA SUDAH TIDAK DI GUNAKAN
//CONTROLLER INI HANYA MENUNJUKAN CARA PENGUNAAN MODUL SSE (SERVER SENT EVENTS)
const express = require("express");
const router = express.Router();
const SSE = require('../../module/SSE')
const configuration = require('../../module/configuration')
let Num = 0

router.get('/', async (req,res)=> {
    console.log(configuration)
    console.log("------------------------")
    console.log(process.env)
    res.status(200).render('pages/SSE_usage_tutorial',{})
})

//Example Get Route
//Mengembalikan jumlah client yang terkoneksi dalam bentuk JSON
router.get('/status', async (req, res) => {
    return res.status(200).json({SSEClients: SSEClients.length});
});

//Inisialisasi koneksi Client
//Bisa dipanggil di controller manapun 
//Variable yang menyimpan Client bersifat Global dan akan ke reset jika aplikasi down
//SSE bisa melakukan reconnecting semisal aplikasi down untuk jangka waktu sementara (tergantung browser yang digunakan)
router.get('/init', (req, res) => {
    SSE.initSSE(req,res)
});

//Example Get Route 
//Akan mengirimkan sebuah event berisi angka
//Angka sesuai symbol tambah atau kurang
//Ke semua connected Client
router.get('/addnum/:symbol', (req,res) =>{
    console.log('masuk add num')
    if(req.params.symbol == '+') Num++
    else Num--
    SSE.sendEventsToAllClient(Num)
    return res.status(200).json('berhasil')
})

module.exports = router;