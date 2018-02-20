const router = global.express.Router();

router.get('/', (req, res) => res.send('root route'));

module.exports = router;