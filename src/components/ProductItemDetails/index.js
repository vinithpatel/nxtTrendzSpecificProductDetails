import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAIL',
  inProgress: 'PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
    productDetails: {},
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const formatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        price: data.price,
        description: data.description,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: this.getCamelCaseData(data.similar_products),
      }

      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: formatedData,
      })
    }
  }

  getCamelCaseData = array =>
    array.map(data => ({
      id: data.id,
      imageUrl: data.image_url,
      title: data.title,
      brand: data.brand,
      style: data.style,
      rating: data.rating,
      availability: data.availability,
      price: data.price,
      description: data.description,
      totalReviews: data.total_reviews,
    }))

  renderLoader = () => (
    <div className="loader" data-testId="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductsDetailsView = () => {
    const {productDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      totalReviews,
      availability,
      brand,
      rating,
    } = productDetails

    return (
      <div className="product-details-bg-container">
        <Header />
        <div className="product-details-container">
          <img className="product-image" src={imageUrl} alt={title} />
          <div className="product-info-card">
            <h1 className="product-heading">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="product-details-rating-card">
              <div className="rating-card">
                <p className="rating-count">{rating}</p>
                <img
                  className="rating-start-icon"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="reviews-para">{totalReviews} Reviews</p>
            </div>
            <p className="product-details-card-desc">{description}</p>
            <p className="available-brand-para">
              Available:{' '}
              <span className="available-brand-online">{availability}</span>
            </p>
            <p className="available-brand-para">
              Brand: <span className="available-brand-online">{brand}</span>
            </p>
            <hr className="harizental-rule" />
            <div className="quantity-control-card">
              <button className="quantity-control-button">-</button>
              <p className="product-quantity">{quantity}</p>
              <button className="quantity-control-button">-</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}

export default ProductItemDetails
