import css from "./ArticlePage.module.less";
import React, { RefObject } from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { Helmet } from "react-helmet-async";
import { ReactPage } from "../../lib/solidify/react/ReactPage";
import { prepareComponent } from "../../helpers/prepareComponent";

interface IProps {
  classNames?: string[];
  parameters?: any;

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}

interface IStates {}

// prepare
const { component, log } = prepareComponent("ArticlePage");

/**
 * @name ArticlePage
 */
class ArticlePage extends ReactPage<IProps, IStates> {
  // define ref
  protected rootRef: RefObject<HTMLDivElement>;

  constructor(pProps: IProps, pContext: any) {
    // relay
    super(pProps, pContext);
    // create ref
    this.rootRef = React.createRef();
  }

  // --------------------------------------------------------------------------- LIFE

  componentDidMount(): void {
    // set current page name in store
    this.props?.setcurrentPageName?.(component);
  }

  // --------------------------------------------------------------------------- TRANSITION

  /**
   * Action on this page.
   * Check props.action and props.parameters to show proper content.
   */
  action() {
    // Remove if not used
  }

  /**
   * Play in animation.
   * Call complete handler when animation is done.
   */
  protected playInHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayIn(this.rootRef, pCompleteHandler);
  }

  /**
   * Play out animation.
   * Call complete handler when animation is done.
   */
  protected playOutHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayOut(this.rootRef, pCompleteHandler);
  }

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={css.ArticlePage} ref={this.rootRef}>
        <Helmet>
          <title>Article</title>
        </Helmet>
        {component}
        <h1>article "{this.props.parameters.slug}"</h1>
        <h5>article ID "{this.props.parameters.id}"</h5>
      </div>
    );
  }
}

export default ArticlePage;
