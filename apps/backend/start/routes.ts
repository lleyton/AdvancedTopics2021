/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', async () => {
//   return { hello: 'world' }
// })

Route.group(() => {
  Route.get('/', 'AppsController.getApps')
  Route.post('/', 'AppsController.createApp')
  Route.get('/:appID', 'AppsController.getApp')
  Route.patch('/:appID', 'AppsController.updateApp')
  Route.get('/:appID/deployments', 'AppsController.getDeployments')
  Route.get('/:appID/variables', 'AppsController.getVariables')
  Route.post('/:appID/variables', 'AppsController.postVariable')
  Route.patch('/:appID/variables/:variableID', 'AppsController.updateVariable')
  Route.delete('/:appID/variables/:variableID', 'AppsController.deleteVariable')
})
  .prefix('/projects/:id/apps')
  .middleware(['auth'])

Route.group(() => {
  Route.get('/', 'ProjectsController.getProjects')
  Route.post('/', 'ProjectsController.createProject')
  Route.get('/:id', 'ProjectsController.getProject')
  Route.get('/:id/members', 'ProjectsController.getProjectMembers')
  Route.put('/:id/members/:userID', 'ProjectsController.putProjectMember')
  Route.delete('/:id/members/:userID', 'ProjectsController.deleteProjectMember')
})
  .prefix('/projects')
  .middleware(['auth'])

Route.group(() => {
  Route.get('/me', 'UsersController.me')
  Route.get('/:id', 'UsersController.get')
})
  .prefix('/users')
  .middleware(['auth'])
