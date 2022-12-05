import React , { Component } from 'react';
import SelectMovie from './selectMovie.sub';
import SelectTheatre from './selectTheatre.sub';
import SelectShowtime from './selectShowtime.sub';
import SelectSeat from './selectSeat.sub';
import PaymentButtonForm from '../paymentForm/paymentButtonForm.component';
class SelectMovieForm extends Component {
    state = {
        step: 1,
        moviename: '',
        theatrename: '', 
        showtime: '',
        seats: '',
        creditcardnum: '',
      }

     // go back to previous step
    prevStep = () => {
        const { step } = this.state;
        this.setState({ step: step - 1 });
    }

    // proceed to the next step
    nextStep = () => {
        const { step } = this.state;
        this.setState({ step: step + 1 });
    }

    // Handle fields change
    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    }

    render() {
        const { step } = this.state;
        const { moviename, theatrename, showtime, seats, creditcardnum } = this.state;
        const values = { moviename, theatrename, showtime, seats, creditcardnum }
        
        switch(step) {
          case 1: 
            return (
              <SelectMovie 
                nextStep={ this.nextStep }
                handleChange={ this.handleChange }
                values={ values }
              />
            )

          case 2: 
            return (
              <SelectTheatre 
                prevStep={ this.prevStep }
                nextStep={ this.nextStep }
                handleChange={ this.handleChange }
                values={ values }
              />
            )
          case 3: 
              return (
                <SelectShowtime 
                  prevStep={ this.prevStep }
                  nextStep={ this.nextStep }
                  handleChange = {this.handleChange}
                  values={ values }
                />
              )
          case 4:
            return (
              <SelectSeat 
                prevStep={ this.prevStep }
                nextStep={ this.nextStep }
                handleChange = {this.handleChange}
                values={ values }
              />
            )
          
          case 5: 
            return (
              <PaymentButtonForm seat_id={values.seats}/> 
            )
          default: 
              // do nothing
        }
    }
}

export default SelectMovieForm;