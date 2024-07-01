import {Children, createContext} from 'react'
const AuthContext = createContext( );

const AuthProvider = ({Children})=>
                    {
                        const [token,setToken]=useState(localStorage.getItem('token'))
                        const [role,setRole] = useState(null);

                        return(
                            <AuthContext.Provider value={(token,user)}>
                                {Children}
                            </AuthContext.Provider>
                        )
                    }

    