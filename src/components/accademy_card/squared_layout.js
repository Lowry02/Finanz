import React from 'react'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

function SquaredAccademyCard(props) {
    let content = props.content

    return (
        <div className="squared_accademy_card bounce">
            <CardMedia
                component="img"
                height="100"
                image={content.getWallpaper()}
                alt="green iguana"
            />
            <CardContent>
                <h5 className="title">{content.getTitle()}</h5>
                <div className="chip_container">
                    <p className="p-1 m-0">{content.getNModules() + " Moduli ·"} {content.getTime() + " Minuti ·"} {"Difficoltà " + content.getDifficultyLevel()}</p>
                </div>
            </CardContent>
        </div>
    )
}

export default SquaredAccademyCard
