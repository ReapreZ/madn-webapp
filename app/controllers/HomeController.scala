package controllers

import com.google.inject.Guice
import de.htwg.madn.controller.ControllerInterface
import de.htwg.madn.model.diceComponent.diceBase.Dice
import de.htwg.madn.start.MADNModule

import javax.inject._
import play.api._
import play.api.mvc._

import scala.util.{Failure, Success}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val injector = Guice.createInjector(new MADNModule)
  val controller = injector.getInstance(classOf[ControllerInterface])

  val dice = new Dice
  var rolledDice = 1
  var playerturnAsChar = 'A';




  
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

  def about() = Action { implicit request: Request[AnyContent] =>
    val currentPath = request.path
    Ok(views.html.about())
  }



  def roll() = Action {
    val playerturn = controller.game.getPlayerturn
    playerturnAsChar = getPlayerturnAsChar(playerturn)
    rolledDice = dice.diceRandom(6)
    if(controller.game.piecesOutList(playerturn) >= 1) {
      Ok("Der Würfel ist auf der " + rolledDice + " gelandet.\n\nWähle die Figur aus mit der du laufen möchtest\n\n"  + gameAsText)
    } else {
      controller.doAndPublish(controller.move1((rolledDice)))
      Ok("Der Würfel ist auf der " + rolledDice.toString + " gelandet.\n\n" + gameAsText)
    }
  }

  def getPlayerturnAsChar(playerturn: Int): Char = {
    controller.getTurnC1(playerturn) match {
      case Success(v) => v
      case Failure(e) => 'e'
    }
  }
  def moveMagic() = Action {
    if (controller.game.piecesOutList(controller.game.playerturn) >= 1) {
      Ok("Der Würfel ist auf der " + 6 + " gelandet.\n\nWähle die Figur aus mit der du laufen möchtest\n\n" + gameAsText)
    } else {
      controller.doAndPublish(controller.move1((6)))
      Ok("Der Würfel ist auf der " + 6.toString + " gelandet.\n\n" + gameAsText)
    }
  }

  def setPieceToMove(pieceToMove: Int) = Action {
    controller.game.pieceChooser = pieceToMove;
    controller.move1(rolledDice)
    Ok(gameAsText)
  }

  def getPlayerturn() = Action {
    val playerturn = getPlayerturnAsChar(controller.game.playerturn)
    Ok(playerturn.toString)
  }

  def showMesh() = Action{
    Ok(controller.game.mesh.mesh())
  }

  def game() = Action {
    Ok(views.html.game(gameAsText))
  }

  private def gameAsText = {


    playerturnAsChar + " hat gerade gewürfelt.\n\n" + controller.game.mesh.mesh()
  }



}
