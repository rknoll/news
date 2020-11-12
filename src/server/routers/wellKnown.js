import Router from 'express-promise-router';

export default () => {
  const router = Router();

  router.get('/assetlinks.json', async (req, res) => {
    console.log('GET /.well-known/assetlinks.json');
    res.send([{
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'at.rknoll.news',
        sha256_cert_fingerprints: ['03:33:DA:1F:04:6C:79:D2:18:6E:4E:50:33:B1:EB:E3:AB:39:33:83:86:86:B6:F0:66:82:70:AB:B3:2C:43:59']
      }
    }]);
  });

  return router;
};
