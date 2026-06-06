import { createContext, useContext, useEffect, useState } from 'react'
import keycloak from '../lib/keycloak'

const AuthContext = createContext(null)

let keycloakInitPromise = null

function initKeycloak() {
  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      checkLoginIframe: false,
    })
  }
  return keycloakInitPromise
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    initialized: false,
    authenticated: false,
    user: null,
    roles: [],
  })

  useEffect(() => {
    let mounted = true

    initKeycloak()
      .then((authenticated) => {
        if (!mounted) return

        const roles = keycloak.tokenParsed?.realm_access?.roles ?? []

        setState({
          initialized: true,
          authenticated,
          user: authenticated
            ? {
                id: keycloak.subject,
                name: keycloak.tokenParsed?.preferred_username,
                email: keycloak.tokenParsed?.email,
              }
            : null,
          roles,
        })
      })
      .catch(() => {
        if (mounted) {
          setState((s) => ({ ...s, initialized: true }))
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const login = () => keycloak.login()
  const logout = () => keycloak.logout({ redirectUri: window.location.origin })

  const hasRole = (role) => state.roles.includes(`ROLE_${role}`)
  const isOrganizer = hasRole('ORGANIZER')
  const isStaff = hasRole('STAFF')

  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasRole, isOrganizer, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)