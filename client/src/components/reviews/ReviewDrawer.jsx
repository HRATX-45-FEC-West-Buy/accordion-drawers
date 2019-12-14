import React from "react";
// import "jquery";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import DrawerHeader from "../DrawerHeader.jsx";
import ReviewBody from "./ReviewBody.jsx";
import axios from "axios";

export default class ReviewDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      reviewData: {
        count: 0,
        reviews: [],
        reviewSummaryData: {
          product_id: 0,
          review_count: 0,
          average_rating: 0,
          five_star: 0,
          four_star: 0,
          three_star: 0,
          two_star: 0,
          one_star: 0,
          would_recommend_pct: 0
        }
      }
    };

    this.toggle = this.toggle.bind(this);
    this.getMoreReviews = this.getMoreReviews.bind(this);
    this.getFilteredReviews = this.getFilteredReviews.bind(this);
    this.getVPReviews = this.getVPReviews.bind(this);
  }

  componentDidMount() {
    //query for review data here?
    axios
      //http://west-buy-drawers.us-east-2.elasticbeanstalk.com
      .get(
        `http://west-buy-drawers.us-east-2.elasticbeanstalk.com/reviews/${this.props.productId}`
      )
      .then(data => {
        if (data.data.count > 0) {
          this.setState({ reviewData: data.data });
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productId != this.props.productId) {
      axios
        //http://west-buy-drawers.us-east-2.elasticbeanstalk.com
        .get(
          `http://west-buy-drawers.us-east-2.elasticbeanstalk.com/reviews/${this.props.productId}`
        )
        .then(data => {
          if (data.data.count > 0) {
            this.setState({ reviewData: data.data });
          }
        });
    }
  }

  getMoreReviews() {}

  getFilteredReviews() {
    let ratings = [...arguments];
  }

  getVPReviews() {}

  toggle() {
    this.setState(state => {
      return { open: !state.open };
    });
  }

  render() {
    return (
      <Card>
        <Card.Header onClick={this.toggle}>
          <DrawerHeader
            isOpen={this.state.open}
            productId={55}
            avgRating={this.state.reviewData.reviewSummaryData.average_rating}
            reviewCount={this.state.reviewData.count}
            label="Reviews"
          />
        </Card.Header>
        <Collapse in={this.state.open}>
          <Card.Body>
            <ReviewBody
              productId={55}
              reviewSummaryData={this.state.reviewData.reviewSummaryData}
              reviewData={this.state.reviewData.reviews}
            />
          </Card.Body>
        </Collapse>
      </Card>
    );
  }
}

ReviewDrawer.propTypes = {
  productId: PropTypes.number
};
