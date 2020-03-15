import React from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import DrawerHeader from "../DrawerHeader.jsx";
import SpecsBody from "./SpecsBody.jsx";
import axios from "axios";

export default class Specs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      specData: {
        product_id: null,
        key_specs: [],
        general: [],
        warranty: [],
        other: []
      }
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    axios
      .get(
        `/specs/${this.props.productId}`
      )
      .then(data => {
        this.setState({ specData: data.data });
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productId != this.props.productId) {
      axios
        .get(
          `/specs/${this.props.productId}`
        )
        .then(data => {
          this.setState({ specData: data.data });
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
          <DrawerHeader isOpen={this.state.open} label="Specifications" />
        </Card.Header>
        <Collapse in={this.state.open}>
          <Card.Body>
            <SpecsBody specsData={this.state.specData} />
          </Card.Body>
        </Collapse>
      </Card>
    );
  }
}

Specs.propTypes = {
  productId: PropTypes.number
};
