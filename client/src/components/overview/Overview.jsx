import React from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import DrawerHeader from "../DrawerHeader.jsx";
import OverviewBody from "./OverviewBody.jsx";
import axios from "axios";

// import styles from './Overview.css';

export default class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      overviewData: {
        description: null,
        features: [],
        whats_included: []
      }
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    axios
      .get(
        `/overview/${this.props.productId}`
      )
      .then(data => {
        this.setState({ overviewData: data.data });
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productId != this.props.productId) {
      axios
        .get(
          `/overview/${this.props.productId}`
        )
        .then(data => {
          this.setState({ overviewData: data.data });
        });
    }
  }

  toggle() {
    this.setState(state => {
      return { open: !state.open };
    });
  }

  render() {
    return (
      <Card>
        <Card.Header onClick={this.toggle}>
          <DrawerHeader isOpen={this.state.open} label="Overview" />
        </Card.Header>
        <Collapse in={this.state.open}>
          <Card.Body>
            <OverviewBody overviewData={this.state.overviewData} />
          </Card.Body>
        </Collapse>
      </Card>
    );
  }
}

Overview.propTypes = {
  productId: PropTypes.number
};
