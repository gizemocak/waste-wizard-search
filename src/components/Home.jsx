import React, { Component, Fragment } from "react";
import List from "./List";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      inputValue: "",
      list: [],
      favourites: []
    };
  }

  async componentDidMount() {
    const response = await fetch(
      "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000"
    );
    const json = await response.json();
    this.setState({ response: json });
  }

  getInputValue = e => {
    this.setState({ inputValue: e.target.value });
    if (e.target.value.length === 0) {
      this.setState({ list: [] });
    }
  };

  handleSearch = e => {
    e.preventDefault();
    if (this.state.inputValue.length > 0) {
      const filtered = this.state.response.filter(
        item => item.keywords.includes(this.state.inputValue) === true
      );
      this.setState({ list: filtered });
      if (this.state.favourites.length === 0) {
        const favourites = window.localStorage.getItem("favourites");
        if (favourites) {
          this.setState({ favourites: favourites.split("-&-") });
        }
      }
    }
  };

  getFavoritesList = () => {
    return this.state.list.filter(item => {
      return this.state.favourites.includes(item.title);
    });
  };

  addToFavourites = id => {
    if (!this.state.favourites.includes(id)) {
      this.setState(
        {
          favourites: [...this.state.favourites, id]
        },
        () => {
          this.addFavouritesToLocalStorage();
        }
      );
    } else {
      this.setState(
        {
          favourites: this.state.favourites.filter(i => i !== id)
        },
        () => {
          this.addFavouritesToLocalStorage();
        }
      );
    }
  };

  addFavouritesToLocalStorage = () => {
    window.localStorage.setItem(
      "favourites",
      this.state.favourites.join("-&-")
    );
  };

  render() {
    return (
      <Fragment>
        <div className="trapezium-container">
          <div className="trapezium">
            <div className="small-circle" />
          </div>
        </div>
        <div className="space" />
        <h1 className="header">Toronto Waste Lookup</h1>
        <form className="form">
          <input
            className="input-box"
            type="text"
            value={this.state.inputValue}
            onChange={this.getInputValue}
          />
          <div className="container-search">
            <button className="button-search" onClick={this.handleSearch}>
              &#9906;
            </button>
          </div>
        </form>
        {this.state.list.length > 0 && this.state.inputValue.length > 0 && (
          <List
            list={this.state.list.sort((a, b) => {
              return this.state.favourites.includes(a.title) ? -1 : 1;
            })}
            addToFavourites={this.addToFavourites}
            favourites={this.state.favourites}
          />
        )}
        {this.state.favourites.length > 0 && this.state.inputValue.length > 0 && (
          <div>
            <h2 className="favourites-header">Favourites</h2>
            <List
              list={this.getFavoritesList()}
              addToFavourites={this.addToFavourites}
              favourites={this.state.favourites}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default Home;
