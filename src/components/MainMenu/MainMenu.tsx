import "./MainMenu.less";
import React from "react";
import { classBlock, className } from "../../helpers/className";
import { Router } from "../../lib/solidify/navigation/Router";
import { prepareComponent } from "../../helpers/prepareComponent";

interface IProps {
  classNames?: string[];
}

// Prepare
const { component, log } = prepareComponent("MainMenu");

/**
 * @name MainMenu
 */
function MainMenu(props: IProps) {
  // --------------------------------------------------------------------------- PREPARE RENDER

  // --------------------------------------------------------------------------- RENDER

  return (
    <nav className={classBlock([component, props.classNames])}>
      <ul className={className(component, "items")}>
        <li>
          <a href={`/`} children={"Home"} data-internal-link />
        </li>
        <li>
          <a
            href={Router.generateURL({
              page: "ArticlePage",
              parameters: {
                id: 5,
                slug: "custom-slug-article"
              }
            })}
            data-internal-link
          >
            Article
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default MainMenu;
