import React from 'react';
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css';

const Header = () => {
	const { onClose } = useTelegram();

	return (
		<div className={'header'}>
			<Button onClick={onClose}>Закрыть</Button>
		</div>
	);
};

export default Header;