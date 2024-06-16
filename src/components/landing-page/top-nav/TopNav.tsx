import './style.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function TopNav() {
	const [showMenu, setShowMenu] = useState(false);
	return (
		<nav className={`top__nav ${showMenu? "active": ""}`}>
			<div className="logo__container"> 
				<img src="/icons/logo.svg" />
				<p>Medix</p>
			</div>
			<div className={`links ${!showMenu && 'hidden'}`}>
				<a href="#hero">Home</a>
				<a href="#features">Features</a>
				<a href="#reviews">Reviews</a>
			</div>
			<Link to="/login">
				Sign In <img src="/icons/sign-in.svg" alt="sign-in" />
			</Link>
			<button onClick={() => setShowMenu(!showMenu)} className="menu__btn">
				<img src={`/icons/${showMenu? "cancel": "menu"}.svg`} alt="" />
			</button>
		</nav>
	);
}
export default TopNav;
