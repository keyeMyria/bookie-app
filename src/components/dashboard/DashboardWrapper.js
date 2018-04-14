import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Image, Menu } from "semantic-ui-react";
import { BookSearchContainer } from "../book-search/BookSearch";
import logo from "../../assets/logo_white.svg";

export class DashboardWrapper extends Component {
  render() {
    return (
      <div className="App">
        <Menu fixed="top" inverted size="large">
          <Container style={{ padding: "5px 0" }}>
            <Menu.Item as="a" header>
              <Link to="/">
                <Image
                  size="tiny"
                  src={logo}
                  style={{ marginRight: "1.5em" }}
                />
              </Link>
            </Menu.Item>

            <BookSearchContainer />

            <Menu.Item name="notes">
              <Link to="/notes">Notes</Link>
            </Menu.Item>
          </Container>
          <Menu.Menu position="right">
            <Menu.Item name="logout" onClick={this.props.logOut} />
          </Menu.Menu>
        </Menu>

        <Container text style={{ marginTop: "7em" }}>
          {this.props.children}
        </Container>
      </div>
    );
  }
}