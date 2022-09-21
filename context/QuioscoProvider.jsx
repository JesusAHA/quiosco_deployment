import {useState,useEffect,createContext} from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const QuioscoContext = createContext()

const QuioscoProvider = ({children}) => {
 
 const [categorias,setCategorias] = useState([])
 const [categoriaActual, setCategoriaActual] =useState({})
 const [producto, setProducto] = useState({})
 const [modal, setModal]=useState(false)
 const [pedido, setPedido] = useState([])
 const [nombre,setNombre]= useState('')
 const [total,setTotal]= useState(0) 
 const router = useRouter()
 //const [paso, setPaso] = useState(1)
   const obtenerCategorias = async() =>{
     const {data} = await axios('/api/categorias')
     setCategorias(data)
   }
   useEffect(() => {
       obtenerCategorias()
   }, [])

   useEffect(() => {
     setCategoriaActual(categorias[0])
   }, [categorias])
   
   useEffect(() => {
    //reduce es un acumulador
     const nuevoTotal = pedido.reduce((total, producto)=>(producto.precio*producto.cantidad) + total,0)
     setTotal(nuevoTotal)
   }, [pedido])
   

   const handleClickCategoria = id =>{
    console.log(id);
    const categoria= categorias.filter(cat=> cat.id === id)
    //acceda a ese arreglo
    setCategoriaActual(categoria[0]);
    router.push('/')
   }
   
   const handleSetProducto = producto =>{
    setProducto(producto)
   }

   const handleChangeModal = () =>{
    setModal(!modal)
   }

   //para sacar categorias del objeto que no se ocupan se realiza lo siguiente
   const handleAgregarPedido = ({categoriaID, ...producto})=>{
   // some itera y verifica si un elemento cumple con la condicion
    if (pedido.some(productoState=>productoState.id=== producto.id)) {
      // Actuazicar la cantidad
       const pedidoActualizado= pedido.map(productoState => 
        productoState.id === producto.id ? producto: productoState)
       setPedido(pedidoActualizado)
       toast.success('Actualizado Correctamente')
    } else{

    setPedido([...pedido, producto])
    toast.success('Agregado al Pedido')
    //console.log(pedido);}
    }
    setModal(false)
  }
/* const handleChangePaso = paso =>{
  setPaso(paso)
}
 */

  const handleEditarCantidades = id =>{
    //console.log(id);
    const productoActualizar = pedido.filter( producto =>
    producto.id === id)
     setProducto(productoActualizar[0]) 
     setModal(!modal)
  }
  const handleEliminarProducto = id=>{
      const pedidoActualizado = pedido.filter(producto =>producto.id !== id)
      setPedido(pedidoActualizado)
  }
  const colocarOrden = async e =>{
    e.preventDefault()
     try {
     const {data}= await axios.post('/api/ordenes',{pedido, nombre, total, fecha:Date.now()})
     //console.log(data);
 
     //Resetear la APP
     setCategoriaActual(categorias[0])
     setPedido([])
     setNombre('')
     setTotal(0)
     toast.success('Pedido Realizado Correctamente')
     setTimeout(() => {
        router.push('/')
     }, 3000);        
     } catch (error) {
         console.error(error);
     }

     //console.log('Enviar Pedido');
   }  
  return (
    <QuioscoContext.Provider
      value={{
          categorias,
          handleClickCategoria,
          categoriaActual,
          producto,
          handleSetProducto,
          modal,
          handleChangeModal,
          handleAgregarPedido,
          pedido,
          handleEditarCantidades,
          handleEliminarProducto,
          nombre,
          setNombre,
          colocarOrden,
          total         
      }}
    
    >
      {children}
    </QuioscoContext.Provider>
  )
}
export{
    QuioscoProvider   
}

export default QuioscoContext
