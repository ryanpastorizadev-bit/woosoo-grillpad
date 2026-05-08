export default defineNuxtRouteMiddleware((to) => {
  const { validateRoute } = useSessionGuard()
  const result = validateRoute(to.path)

  if (!result.allowed && result.redirectTo)
    return navigateTo(result.redirectTo)
})
