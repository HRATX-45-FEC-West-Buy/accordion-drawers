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
        count: null,
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
      },
      filters: {
        vp: false
      },
      ratingFilters: {},
      ratingFiltersActive: false,
      filteredCount: 0,
      vpReviews: [],
      vpCount: 0,
      listExtended: false,
      renderedReviews: []
    };

    this.toggle = this.toggle.bind(this);
    this.truncateReviews = this.truncateReviews.bind(this);
    this.extendReviews = this.extendReviews.bind(this);
    this.getVPReviews = this.getVPReviews.bind(this);
    this.renderVPReviews = this.renderVPReviews.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.toggleRatingFilter = this.toggleRatingFilter.bind(this);
    this.restoreReviews = this.restoreReviews.bind(this);
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  componentDidMount() {
    //query for review data here
    axios
      .get(
        `/reviews/${this.props.productId}`
      )
      .then(data => {
        if (data.data.count && data.data.count > 0) {
          this.setState({ reviewData: data.data }, () => {
            this.setState({ renderedReviews: this.truncateReviews(8) });
          });
        } else {
          let reviewData = this.state.reviewData;
          reviewData.count = 0;
          this.setState({reviewData});
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productId != this.props.productId) {
      axios
        .get(
          `/reviews/${this.props.productId}`
        )
        .then(data => {
          if (data.data.count && data.data.count > 0) {
            this.setState({ reviewData: data.data }, () => {
              this.setState({ renderedReviews: this.truncateReviews(8) });
            });
          } else {
            let reviewData = this.state.reviewData;
            reviewData.count = 0;
            this.setState({reviewData});
          }
        });
    }
  }

  truncateReviews(num, r = this.state.reviewData.reviews) {
    console.log("I'm truncating reviews");
    let reviews = r.slice();
    return reviews.filter((review, index) => {
      return index < num;
    });
  }

  extendReviews() {
    //right now only checks for VP filter
    if (this.state.filters.vp) {
      this.setState({
        renderedReviews: this.truncateReviews(16, this.state.vpReviews),
        listExtended: true
      });
    } else {
      this.setState({
        renderedReviews: this.truncateReviews(16),
        listExtended: true
      });
    }
  }

  toggleRatingFilter(filter = "tricksy") {
    let ratingFilters = this.state.ratingFilters;
    let ratingFiltersActive = this.state.ratingFiltersActive;
    let filteredCount = this.state.filteredCount;

    let reviewsToFilter = this.state.filters.vp
      ? this.state.vpReviews
      : this.state.reviewData.reviews;

    let renderedReviews = [];

    if (!ratingFilters.hasOwnProperty(filter)) {
      ratingFilters[filter] = true;
      ratingFiltersActive = true;

      let filteredReviews = reviewsToFilter.filter(review =>
        ratingFilters.hasOwnProperty(review.rating)
      );

      filteredCount = filteredReviews.length;

      if (this.state.listExtended) {
        renderedReviews = this.truncateReviews(16, filteredReviews);
      } else {
        renderedReviews = this.truncateReviews(8, filteredReviews);
      }
    } else {
      delete ratingFilters[filter];

      if (Object.keys(ratingFilters).length === 0) {
        ratingFiltersActive = false;
        if (this.state.listExtended) {
          renderedReviews = this.truncateReviews(16, reviewsToFilter);
        } else {
          renderedReviews = this.truncateReviews(8, reviewsToFilter);
        }
      } else {
        let filteredReviews = reviewsToFilter.filter(review =>
          ratingFilters.hasOwnProperty(review.rating)
        );

        filteredCount = filteredReviews.length;

        if (this.state.listExtended) {
          renderedReviews = this.truncateReviews(16, filteredReviews);
        } else {
          renderedReviews = this.truncateReviews(8, filteredReviews);
        }
      }
    }

    this.setState({
      renderedReviews,
      ratingFilters,
      ratingFiltersActive,
      filteredCount
    })
  }

  getVPReviews() {
    let vpReviews = this.state.reviewData.reviews.filter((review, index) => {
      return review.verified_purchase;
    });
    return vpReviews;
  }

  renderVPReviews() {
    let vpReviews = this.getVPReviews();
    let vpCount = vpReviews.length;
    this.setState(state => {
      let filters = { ...this.state.filters };
      filters.vp = true;
      return {
        renderedReviews: this.truncateReviews(8, vpReviews),
        vpReviews,
        vpCount,
        filters
      };
    });
  }

  removeFilter(filter) {
    //only works for verified filter right now because truncateReviews will always reset to initial 8 reviews as it is, with no filters
    console.log("Calling removeFilter with ", filter, " as the filter");
    let filters = { ...this.state.filters };
    filters[filter] = false;
    this.setState({
      renderedReviews: this.truncateReviews(8),
      filters,
      listExtended: false
    });
  }

  restoreReviews() {
    let filters = { vp: false };
    let ratingFilters = {};
    let ratingFiltersActive = false;
    let filteredCount = 0;
    let listExtended = false;
    this.setState({
      renderedReviews: this.truncateReviews(8),
      filters,
      ratingFilters,
      ratingFiltersActive,
      filteredCount,
      listExtended
    });
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
              productId={this.props.productId}
              reviewSummaryData={this.state.reviewData.reviewSummaryData}
              reviewData={this.state.renderedReviews}
              filters={this.state.filters}
              vpCount={this.state.vpCount}
              extendReviews={this.extendReviews}
              renderVPReviews={this.renderVPReviews}
              removeFilter={this.removeFilter}
              extended={this.state.listExtended}
              toggleRatingFilter={this.toggleRatingFilter}
              ratingFiltersActive={this.state.ratingFiltersActive}
              filteredCount={this.state.filteredCount}
              activeFilters={{ ...this.state.ratingFilters }}
              restoreReviews={this.restoreReviews}
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
