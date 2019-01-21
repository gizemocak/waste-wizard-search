import React, { Fragment } from "react";
import "../App.css";
import Svg from "./Svg";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  cleanEntities = itemBody => {
    const regexLT = /&lt;/gi;
    const regexGT = /&gt;/gi;
    const regexBR = /&amp;nbsp;/gi;
    return itemBody
      .replace(regexLT, "<")
      .replace(regexGT, ">")
      .replace(regexBR, " ");
  };

  render() {
    return (
      <Fragment>
        <ul className="item-list">
          {this.props.list &&
            this.props.list.map(item => {
              return (
                <li className="list-container" key={item.title}>
                  <div className="list-inner-container">
                    <div className="star-container">
                      <div
                        onClick={() => {
                          this.props.addToFavourites(item.title);
                        }}
                      >
                        <Svg
                          isFavorite={this.props.favourites.includes(
                            item.title
                          )}
                        />
                      </div>
                    </div>
                    <div className="title">{item.title}</div>
                    <div
                      className="body"
                      dangerouslySetInnerHTML={{
                        __html: this.cleanEntities(item.body)
                      }}
                    />
                  </div>
                </li>
              );
            })}
        </ul>
      </Fragment>
    );
  }
}

export default List;
