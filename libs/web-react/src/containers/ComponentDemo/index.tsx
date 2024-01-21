import { Component } from 'react';
import ReactHtmlParser from 'html-react-parser';
import { components } from '../../utils/storage';

class ComponentDemo extends Component {
  props: any;
  state: any;
  static propTypes: any;
  constructor(props) {
    super(props);
    this.state = {
      runJavascript: this.runJavascript.bind(this),
    };
  }

  componentDidMount() {
    const { pageData = {} } = this.props;
    this.setState({
      title: pageData.title,
    });
    this.runJavascript();
  }

  runJavascript() {
    const { pageData = {} } = this.props;
    if (pageData.setUpJavascript) {
      eval(pageData.setUpJavascript);
    }
    eval(pageData.javascript);
  }
  static getDerivedStateFromProps(props, state) {
    const { pageData = {} } = props;
    if (pageData.title !== state.title) {
      state.runJavascript();
      return {
        title: pageData.title,
        runJavascript: state.runJavascript,
      };
    }
  }

  render() {
    const { metaData = {}, pageData = {}, transitionClass } = this.props;
    const { className = '' } = pageData;
    const { Header, LinkButton, NavigationList, CodeHighlight } = components.get();
    return (
      <div className={`sq-content-toc sq-content-page__body ${className}`}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-md-3">
              <NavigationList links={metaData.siblingPages} />
            </div>
            <div className={`col-xs-12 col-md-9 ${transitionClass}`}>
              {/* <Content pageData={pageData} metaData={metaData} {...rest} /> */}
              <Header
                header={pageData.title}
                subHeader={pageData.description}
              />
              {pageData.jsFiddle && (
                <LinkButton
                  href={pageData.jsFiddle}
                  target={'_blank'}
                  iconName="arrow-right"
                  iconDirection="right"
                  buttonText="Edit in fiddle"
                  className={'mb-wide'}
                />
              )}
              <h5 className="mb-wide">Example</h5>
              <div className="mb-wide">{ReactHtmlParser(pageData.html)}</div>
              <h5 className="mb-wide">HTML</h5>
              <CodeHighlight
                language="html"
                className="mb-wide"
                code={pageData.html}
              />
              <h5 className="mb-wide">JAVASCRIPT</h5>
              <CodeHighlight
                language="javascript"
                className="mb-wide"
                code={pageData.javascript}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ComponentDemo.propTypes = {};

export default ComponentDemo;
