import React, { useState } from "react";
import "./CategoryCard.css";
import Card from "./Card";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import Popup from "../popup/Popup";
import Button from "../button/Button";
import Input from "../form/input/Input";

const CategoryCard = ({ category, iconSize = 20, onDelete, onEdit }) => {

    const [name, setName] = useState(category.name);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <>
            <Card className={"cat-card"}>
                <div className="cat-title">{category.name}</div>
                <div className="cat-actions">
                    <div onClick={() => { openPopup(true); setName(category.name); }} className="cat-edit-icon icon">
                        <FaRegEdit size={iconSize} />
                    </div>
                    <div onClick={() => onDelete(category.id)} className="cat-delete-icon icon">
                        <AiOutlineDelete size={iconSize} />
                    </div>
                </div>
            </Card>

            <Popup isOpen={isPopupOpen} title={'Edit category'} onClose={closePopup} >
                <Input type={'text'} value={name} onChange={(e) => setName(e.target.value)} label={'Name'} placeholder={'Enter category name'} />
                <div className="cat-update-btn">
                    <Button onClick={() => onEdit(category.id, name)} varient={'primary'} >Update</Button>
                </div>
            </Popup>
        </>

    );
};

export default CategoryCard;
