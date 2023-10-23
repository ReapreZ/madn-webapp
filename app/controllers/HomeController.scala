package controllers

import com.google.inject.Guice
import de.htwg.madn.controller.ControllerInterface
import de.htwg.madn.controller.controllerBase.Controller
import de.htwg.madn.model.gameComponent.GameInterface
import de.htwg.madn.model.gameComponent.gameBase.Game
import de.htwg.madn.model.meshComponent.meshBase.Mesh
import de.htwg.madn.start.MADNModule

import javax.inject._
import play.api._
import play.api.mvc._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {


  val mesh = new Mesh(2);
  //val game = new Game(2, mesh);
  //val controller = new Controller(game);
  private val injector = Guice.createInjector(new MADNModule)
  val controller = injector.getInstance(classOf[ControllerInterface])



  private def gameAsText = { mesh.mesh() }






  




  
  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }



}
