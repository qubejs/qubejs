import { Response, utils } from '@qubejs/core';
const { path } = utils;

export default ({ context }: any = {}) => {
  context.router.post('/content/page', function (req, res) {
    const paths = context.contentRepo.extractPath(req.body.path, req.body.type);
    const data:any = {};
    if (req.body.importDefault === 'Y' && req.body.type === 'SITE_MAP') {
      data.pageData = context.config.siteConfig;
    }
    context.contentRepo
      .checkExists({ path: path.ensureNoSlashAtEnd(paths.path) }, ['path'])
      .then(() => {
        context.contentRepo
          .create({ ...req.body, ...data })
          .then((result) => {
            res.json(new Response(result).json());
          })
          .catch((ex) => context.handleError(ex, res));
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/content/meta', function (req, res) {
    context.contentRepo
      .getMeta()
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.patch('/content/page', function (req, res) {
    context.contentRepo
      .saveDraft(req.body)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/content/page/clone', function (req, res) {
    context.contentRepo
      .checkExists({ path: path.ensureNoSlashAtEnd(req.body.to) }, ['to'])
      .then(() => {
        context.contentRepo
          .copyContent(req.body)
          .then((result) => {
            res.json(new Response(result).json());
          })
          .catch((ex) => context.handleError(ex, res));
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.delete('/content/page', function (req, res) {
    context.contentRepo
      .deleteById(req.body.uid)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/content/page/get', function (req, res) {
    context.contentRepo
      .getByPath(req.body.path)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/content/page/gettree', function (req, res) {
    context.contentRepo
      .getAllTreeNodes(req.body.path)
      .then((result) => {
        res.json(new Response(result).json());
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/content/page/getbypath', function (req, res) {
    context.contentRepo
      .getAllPages(req.body.parentPath)
      .then((result) => {
        res.json(
          new Response({
            pages: result,
          }).json()
        );
      })
      .catch((ex) => context.handleError(ex, res));
  });
  context.router.post('/content/emailtemplates/search', function (req, res) {
    context.emailTemplateRepo
      .searchAll(req.body)
      .then((result) => {
        res.json(
          new Response(result).json()
        );
      })
      .catch((ex) => context.handleError(ex, res));
  });
};
