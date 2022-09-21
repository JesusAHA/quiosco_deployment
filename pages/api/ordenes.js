// req lo que tu mandas al servidor
// res lo que tu recibes del servidor
import {PrismaClient} from '@prisma/client'

export default async function handler(req,res) {
   const prisma = PrismaClient()
   
    if (req.method ==='POST') {
        const orden= await prisma.orden.create({
            data: {
                nombre: req.body.nombre,
                total:req.body.total,
                predido:req.body.pedido,
                fecha:req.body.fecha,
                  },
        }) 
        res.json({orden})
       // console.log(req.body);
    }
    
}