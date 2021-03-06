import { NavLink } from 'react-router-dom';
import moment from 'moment'
import './AllEx.css'

export default function AllEx(props) {
    const exLis = props.exchanges.map(ex => {
        return (
            <li key={ex.id}>
                <NavLink to={`/exchange/${ex.id}`}>
                    {ex.title}
                </NavLink>
                <p className='date-created'>{moment(ex.date_created).format('l')}</p>   
            </li>
        ) 
    })

    const exDisplay = props.exchanges.length > 0 ? <ul>{exLis}</ul> : <h5>No exchanges to display.</h5>
    return (
        <section className='all-exchanges dashboard-section'>
            <h2>All Exchanges</h2>
            {exDisplay}
        </section>
    )
}