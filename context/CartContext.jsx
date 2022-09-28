import React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

const CartItem = {
  price: number,
  name: "",
  description: "",
  quantity: 0,
  url: "",
}

const CartContext = React.createContext({
  clearCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  addToCart,
  setCartVisibility,
  visible,
  cartItem})

export const useCartContext = () => React.useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [visible, setCartVisibility] = React.useState(false)
  const [cartItems, setCartItems] = React.useState([])
  const { status } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    const cart = loadFromLocalStorage()

    if (cart) {
      setCartItems(cart)
    }
  }, [])

  React.useEffect(() => {
    saveToLocalStorage(cartItems)
  }, [cartItems])

  function loadFromLocalStorage() {
    try {
      return JSON.parse(window.localStorage.getItem("vrs:cart"))
    } catch ({ message }) {
      throw new Error(message)
    }
  }

  function saveToLocalStorage(data) {
    try {
      window.localStorage.setItem("vrs:cart", JSON(data))
    } catch ({ message }) {
      throw new Error(message)
    }
  }

  function addToCart(details) {
    if (status === "unauthenticated") {
      return router.push('/login')
    }

    const cartItem = cartItems.find(({ id }) => id === details.id)

    if (!cartItem) {
      setCartItems([
        ...cartItems,
        { ...details, quantity: 1 },
      ])
    } else {
      setCartItems([
        ...cartItems.filter(item => item.id !== cartItem.id),
        { ...cartItem, quantity: cartItem.quantity += 1 },
      ])
    }

    setCartVisibility(true)
  }

  function removeFromCart(id) {
    return setCartItems(cartItems.filter(item => item.id !== id))
  }

  function decrementQuantity(id) {
    const items = [...cartItems]
    const cartItem = items.find(item => item.id === id)

    if (cartItem.quantity > 0) {
      cartItem.quantity -= 1
      setCartItems(items)
    }
  }

  function incrementQuantity(id) {
    const items = [...cartItems]
    const cartItem = items.find(item => item.id === id)

    cartItem.quantity += 1
    setCartItems(items)
  }

  function clearCart() {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{
      clearCart,
      incrementQuantity,
      decrementQuantity,
      removeFromCart,
      addToCart,
      setCartVisibility,
      visible,
      cartItems
    }}>
      {children}
    </CartContext.Provider>
  )
}