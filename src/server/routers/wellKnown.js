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
        sha256_cert_fingerprints: ['6D:CE:6B:B8:58:FA:76:A5:75:86:CD:5A:B8:A8:0F:D7:1A:10:41:2E:DE:08:7C:D0:94:DA:41:42:E1:0F:2B:71']
      }
    }]);
  });

  return router;
};
