import FS from 'fs';
import chalk from 'chalk';

class BaseBuild {
  tags: any;
  localVars: any;
  localTags: any;
  localHtml: any;
  config: any;
  constructor(appConfig = {}, config = {}) {
    this.config = Object.assign(
      {
        host: '',
        target: 'mobile',
        rootClass: 'app-root',
        indexHtml: '',
        metaTags: '',
        metaTagsAppend: '',
        scripts: '',
      },
      config
    );
    const _appConfig = {
      ...appConfig,
    };
    this.tags = {
      findLink: '<link',
      findScript: '<script',
      findBody: '<noscript',
      htmlToInclude: `
        <body class="${this.config.rootClass}">
      `,
      metaTags:
        ` <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
       <meta http-equiv="Content-Security-Policy" content="
      default-src * data: blob: ws: wss: gap://ready file://*;
      style-src * 'unsafe-inline';
      script-src * 'unsafe-inline' 'unsafe-eval';
      connect-src * ws: wss:;">
      ` +
        `<meta name="format-detection" content="telephone=no">` +
        `<meta name="msapplication-tap-highlight" content="no">
        <style> 
          html {
            height: calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom))) !important;
          }
        </style>
        ${this.config.metaTags}`,

      scriptToInclude: `<script type="text/javascript">
        window.APP_CONFIG = ${JSON.stringify(_appConfig)};
        window.API_SERVER = '${this.config.host}';
        </script>
        <script type="text/javascript" src="cordova.js"></script>
        <script>
            window.addEventListener("orientationchange", function() {
              var originalMarginTop = document.body.style.marginTop;
              document.body.style.marginTop = "1px";
              setTimeout(function () {
                  document.body.style.marginTop = originalMarginTop;
                  window.setFullHeight && window.setFullHeight();
              }, 100);
          }, false);
      </script>
    ${this.config.scripts}`,
    };
    this.localVars = {
      start: '<!-- LOCAL_CONFIG_REMOVE_START -->',
      end: '<!-- LOCAL_CONFIG_REMOVE_END -->',
    };
    this.localTags = {
      start: '<!-- LOCAL_TAGS_REMOVE_START -->',
      end: '<!-- LOCAL_TAGS_REMOVE_END -->',
    };
    this.localHtml = {
      start: '<!-- LOCAL_HTML_REMOVE_START -->',
      end: '<!-- LOCAL_HTML_REMOVE_END -->',
    };
  }

  processDefault() {
    console.log(chalk.cyan(`${this.config.target}: processing html`));
    let data = FS.readFileSync(this.config.indexHtml, 'utf8');
    console.log(
      chalk.cyan(`${this.config.target}: removing local configuration`)
    );
    data = this.removeContent(data, this.localVars.start, this.localVars.end);
    console.log(
      chalk.cyan(`${this.config.target}: removing tags configuration`)
    );
    data = this.removeContent(data, this.localTags.start, this.localTags.end);
    console.log(
      chalk.cyan(`${this.config.target}: removing html configuration`)
    );
    data = this.removeContent(data, this.localHtml.start, this.localHtml.end);
    console.log(chalk.cyan(`${this.config.target}: inserting meta`));
    const afterAddingMeta = this.insertContent(
      data,
      this.tags.findLink,
      this.tags.metaTags
    );
    console.log(chalk.cyan(`${this.config.target}: inserting scripts`));
    const afterAddingScript = this.insertContent(
      afterAddingMeta,
      this.tags.findScript,
      this.tags.scriptToInclude
    );
    console.log(chalk.cyan(`${this.config.target}: inserting html`));
    const afterAddingHtml = this.insertContent(
      afterAddingScript,
      this.tags.findBody,
      this.tags.htmlToInclude
    );
    return afterAddingHtml;
  }

  insertContent(fullContent, beforeWhat, newContent) {
    // get the position before which newContent has to be added
    const position = fullContent.indexOf(beforeWhat);

    // since splice can be used on arrays only
    const fullContentCopy = fullContent.split('');
    fullContentCopy.splice(position, 0, newContent);

    return fullContentCopy.join('');
  }

  removeContent(fullContent, beforeWhat, tillWhat) {
    // get the position before which newContent has to be added
    const posStart = fullContent.indexOf(beforeWhat);
    const posEnd = fullContent.indexOf(tillWhat);
    const part1 = fullContent.substring(0, posStart);
    const part2 = fullContent.substring(posEnd + tillWhat.length);
    return part1 + part2;
  }
}

export default BaseBuild;
