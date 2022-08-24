import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createAReview, getAllSpotReviews } from '../../store/reviews';

function CreateReviewForm({spot}) {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user)

  const [stars, setStars] = useState('')
  const [review, setReview] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => {
    const errors = []
    if (stars < 1 || stars > 5) errors.push("Stars must be between 1 and 5")
    if (!review) errors.push("Review is required")

    return setValidationErrors(errors)
  }, [stars, review])


  const handleSubmit = async (e) => {
    e.preventDefault()
    setHasSubmitted(true)
    if (validationErrors.length > 0) {
      return alert("Cannot Submit");
    }

    const payload = {
      spotId: Number(id),
      userId: Number(sessionUser.id),
      stars: Number(stars),
      review
    }
    let createReview = await dispatch(createAReview(payload))
    await dispatch(getAllSpotReviews(id))
    if (createReview) {
      history.push(`/spots/${id}`)
    } 
  }
  return (
    <section>
      <h2>Write a Review</h2>
      {hasSubmitted && validationErrors.length > 0 && (
        <div>
          The following errors were found:
          <ul>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
        type="number"
        min="1"
        max="5"
        placeholder='Stars'
        required
        value={stars}
        onChange={(e) => setStars(e.target.value)}
        />
        <textarea
        id="review"
        onChange={(e) => setReview(e.target.value)}
        value={review}
        placeholder="Write your review here"
        >
        </textarea>
        <button>Submit</button>
      </form>
    </section>
  )
}
export default CreateReviewForm