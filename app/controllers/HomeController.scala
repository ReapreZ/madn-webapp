package controllers

import com.google.inject.Guice
import de.htwg.madn.controller.ControllerInterface
import de.htwg.madn.model.DataComponent.DataToJson
import de.htwg.madn.model.diceComponent.diceBase.Dice
import de.htwg.madn.start.MADNModule

import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import javax.inject._
import play.api._
import play.api.mvc._
import play.api.http.{ContentTypeOf, ContentTypes, Writeable}
import scala.util.{Failure, Success}
import akka.util.ByteString

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

 /* private val injector = Guice.createInjector(new MADNModule)
  val controller = injector.getInstance(classOf[ControllerInterface])*/
  val data: DataToJson = new DataToJson

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

  def rules() = Action { implicit request: Request[AnyContent] =>
    val currentPath = request.path
    Ok(views.html.rules())
  }

   def feedback() = Action { implicit request: Request[AnyContent] =>
    val currentPath = request.path
    Ok(views.html.feedback())
  }

  def game() = Action {
    Ok(views.html.game(gameAsText))
  }

  private def gameAsText = {
    playerturnAsChar + " hat gerade gewürfelt.\n\n" + data.getPlayerTurnAsJson//controller.printPlayerTurn
  }






  def getPlayerTurn = Action {
    val playerTurnJson = data.getPlayerTurnAsJson
    Ok(playerTurnJson)
  }

  def getPiecesList = Action {
    val piecesListJson = convertToJsonString(data.pieceList)
    Ok(piecesListJson).as("application/json")
  }

  def getPiecesOut = Action {
    val piecesOutJson = convertJsonToStringFromSimpleArray(data.getPiecesOutAsJson)
    Ok(piecesOutJson)
  }

  def getTimesPlayerRolled = Action {
    val timesPlayerRolledJson = data.getTimesPlayerRolledAsJson
    Ok(timesPlayerRolledJson)
  }

  def getPlayerAmount = Action {
    val playerAmountJson = data.getPlayerAmountAsJson
    Ok(playerAmountJson)
  }

  def getRolledDice = Action {
    val rolledDiceJson = data.getRolledDiceAsJson
    Ok(rolledDiceJson)
  }



  def playerturnToJson(playerturn: Int): JsValue = {
    return Json.toJson(playerturn)
  }

  def convertToJsonString(array: Array[Array[Int]]): String = {
    Json.toJson(array).toString()
  }

  def convertToJsonStringFromSimpleArray(array: Array[Int]): String = {
    Json.toJson(array).toString()
  }

  def convertJsonToStringFromSimpleArray(jsValue: JsValue): String = {
    val array: Array[Int] = jsValue.as[Array[Int]]
    Json.toJson(array).toString()
  }

  def setPlayerturn() = Action(parse.json) {
    request =>
      val playerturnJson = request.body
      //data.playerturn = 
      data.setPlayerTurnFromJson(playerturnJson)
      Ok("Playerturn successfully set")
  }

  //request.body.validate[Array[Array[Int]]].map 




}
