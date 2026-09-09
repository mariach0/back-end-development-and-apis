import express from 'express'

const router = express.Router()

const SUPPORTED_CITIES = [
    "Tokyo", "London", "Paris"
];

router.get('/', (req, res) => {
    res.status(200).json({ SUPPORTED_CITIES })
})

router.get('/:city', async (req, res) => {
    const city = req.params.city
    try {
        const weather = await fetch(
            `https://weather-proxy.freecodecamp.rocks/api/city/${city}`
        )
        if(!weather.ok) {
            throw new Error(`Status ${weather.status}`)
        }

        const data = await weather.json()

        res.status(200).json({
            "city": data.name,
            "temperature": data.main.temp,
            "description": data.weather[0].description
        })

    } catch (error) {
        res.status(404).json({error : error.message})
    }

})


export default router