package controllers

import com.google.inject.Guice
import de.htwg.madn.controller.ControllerInterface
import de.htwg.madn.model.DataComponent.DataToJson
import de.htwg.madn.model.DataComponent.Changed._
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
import play.api.libs.streams._
import scala.swing.Reactor
import akka.actor._

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents, implicit val system: ActorSystem) extends BaseController {

  val data: DataToJson = new DataToJson

  val dice = new Dice
  var rolledDice = 1
  var playerturnAsChar = 'A';

   class MadnActor(out: ActorRef) extends Actor with Reactor {
    listenTo(data)
    override def receive = {
      case UpdateFromBackend(updatedVar) =>
        out ! s"updateFromBackend($updatedVar)"
    }

    reactions += {
      case event: PlayerturnChanged =>
        out ! sendJsonToClient("playerturn")
      case event: PlayeramountChanged =>
        out ! sendJsonToClient("playeramount")
      case event: RolledDiceChanged =>
        out ! sendJsonToClient("rolledDice")
      case event: TimesPlayerRolledChanged =>
        out ! sendJsonToClient("timesPlayerRolled")
      case event: PiecesListChanged =>
        out ! sendJsonToClient("piecesList")
    }

    override def preStart(): Unit = {
    println("MadnActor started")
  }

  override def postStop(): Unit = {
    println("MadnActor stopped")
  }

  override def preRestart(reason: Throwable, message: Option[Any]): Unit = {
    println(s"MadnActor restarting due to ${reason.getMessage}", reason)
    super.preRestart(reason, message)
  }

  override def postRestart(reason: Throwable): Unit = {
    println("MadnActor restarted")
    super.postRestart(reason)
  }

    def sendJsonToClient(event: String) = {
      event match {
        case "playerturn" => 
          out ! UpdateFromBackend("playerturn")
          out ! UpdateFromBackend("playeramount")
          out ! UpdateFromBackend("rolledDice")
          out ! UpdateFromBackend("timesPlayerRolled")
          out ! UpdateFromBackend("piecesList")
      }
    }
  }

  case class UpdateFromBackend(updatedVar: String)


  object MadnActorFactory {
    def create(out: ActorRef) = {
      Props(new MadnActor(out))
    }
  }

  def socket() = WebSocket.accept[String, String] { request =>
      ActorFlow.actorRef { out => MadnActorFactory.create(out) }
  }



  
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


def setPlayerturn() = Action(parse.json) { request =>
  val playerturnJson = request.body
  val playerturn = (playerturnJson \ "playerturnBackend").asOpt[Int]

  playerturn.foreach { value =>
    val playerturnJsValue: JsValue = Json.toJson(value)
    data.setPlayerTurnFromJson(playerturnJsValue)
  }
  Ok("Playerturn successfully set")
}

def setTimesPlayerRolled() = Action(parse.json) { request =>
  val timesPlayerRolledJson = request.body
  val timesPlayerRolled = (timesPlayerRolledJson \ "timesPlayerRolledBackend").asOpt[Int]

  timesPlayerRolled.foreach { value =>
    val timesPlayerRolledJsValue: JsValue = Json.toJson(value)
    data.setTimesPlayerRolledFromJson(timesPlayerRolledJsValue)
  }
  Ok("TimesPlayerRolled successfully set")
}

def setRolledDice() = Action(parse.json) { request =>
  val rolledDiceJson = request.body
  val rolledDice = (rolledDiceJson \ "rolledDiceBackend").asOpt[Int]

  rolledDice.foreach { value =>
    val rolledDiceJsValue: JsValue = Json.toJson(value)
    data.setRolledDiceFromJson(rolledDiceJsValue)
  }
  Ok("RolledDice successfully set")
}

def setPlayeramount() = Action(parse.json) { request =>
  val playeramountJson = request.body
  val playeramount = (playeramountJson \ "playeramountBackend").asOpt[Int]

  playeramount.foreach { value =>
    val playeramountJsValue: JsValue = Json.toJson(value)
    data.setPlayerAmountFromJson(playeramountJsValue)
  }
  Ok("Playeramount successfully set")
}

def setPiecesOut() = Action(parse.json) { request =>
  val jsonData = request.body
  val piecesOut = (jsonData \ "piecesOutBackend").asOpt[Seq[Int]].getOrElse(Seq.empty[Int])

  val piecesOutJsValue: JsValue = Json.toJson(piecesOut)
  data.setPiecesOutFromJson(piecesOutJsValue)
  Ok("PiecesOut successfully set")
}

def setPiecesList() = Action(parse.json) { request =>
    val jsonData = request.body

    val piecesList = (jsonData \ "piecesListBackend").asOpt[Seq[Seq[Int]]].getOrElse(Seq.empty[Seq[Int]]).map(_.toArray).toArray

    val piecesListJsValue: JsValue = Json.toJson(piecesList)
    data.setPieceListFromJson(piecesListJsValue)

    Ok("PiecesList successfully set")
}




  //request.body.validate[Array[Array[Int]]].map 


}
