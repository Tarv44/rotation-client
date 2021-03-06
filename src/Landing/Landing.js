import { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Landing.css'

export default class Landing extends Component {
    render() {
        return (
            <main className='landing'>
                <header className="landing-header">
                    <h1 className='landing-title'>Rotatio<span id="last-letter">n</span></h1>
                </header>

                <section className="welcome-section">
                    <h2>Welcome!</h2>
                    <p>
                        Whether you're a musician, a record head, or just an excited fan, it's a pleasure to share the
                        music you care about with those around you. These days, "those around you" is likely just your 
                        roommate or dog. 
                    </p>
                    <p>
                        Rotation was created as a tool for deeper music conversation between acquaintances far and wide, 
                        that goes beyond texting a basic link to a streaming platform. It allows you to create your own 
                        chat room for the music you're listening to that you can share with your friends.
                    </p>
                </section>

                <section className="get-started">
                    <h2>Get Started</h2>
                    <p>
                        Create an account (or login) and make a new exchange to get started. Once you've made an exchange, 
                        share the url for your new exchange with a friend to get them in on the convo.
                    </p>
                    <div className='account-buttons'>
                        <NavLink to={'/signup'} className='signup-button'><button>Signup</button></NavLink>
                        <NavLink to={'/login'}><button>Login</button></NavLink>
                    </div>
                </section>
            </main>
        )
    }
}