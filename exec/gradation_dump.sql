-- MySQL dump 10.13  Distrib 9.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: gradation_db
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `friends_id` int unsigned NOT NULL,
  `status` enum('REQUESTED','ACCEPTED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REQUESTED',
  PRIMARY KEY (`id`),
  KEY `fk_friends_user` (`user_id`),
  KEY `fk_friends_friend` (`friends_id`),
  CONSTRAINT `fk_friends_friend` FOREIGN KEY (`friends_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_friends_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (3,32,26,'ACCEPTED'),(4,26,32,'ACCEPTED'),(5,33,26,'ACCEPTED'),(6,26,33,'ACCEPTED'),(7,34,26,'ACCEPTED'),(8,26,34,'ACCEPTED'),(9,33,28,'ACCEPTED'),(10,34,33,'ACCEPTED'),(11,33,34,'ACCEPTED'),(12,28,33,'ACCEPTED'),(13,25,34,'ACCEPTED'),(14,34,25,'ACCEPTED'),(15,29,34,'ACCEPTED'),(16,34,29,'ACCEPTED'),(17,29,25,'ACCEPTED'),(18,25,29,'ACCEPTED'),(19,34,28,'ACCEPTED'),(20,28,34,'ACCEPTED'),(21,36,37,'ACCEPTED'),(22,37,36,'ACCEPTED'),(23,27,34,'ACCEPTED'),(24,34,27,'ACCEPTED'),(25,33,25,'ACCEPTED'),(26,25,33,'ACCEPTED'),(27,33,29,'ACCEPTED'),(28,29,33,'ACCEPTED'),(29,38,39,'ACCEPTED'),(30,38,40,'ACCEPTED'),(31,38,41,'ACCEPTED'),(32,38,42,'ACCEPTED'),(33,38,43,'ACCEPTED'),(34,39,40,'ACCEPTED'),(35,39,41,'ACCEPTED'),(36,39,42,'ACCEPTED'),(37,39,43,'ACCEPTED'),(38,40,41,'ACCEPTED'),(39,40,42,'ACCEPTED'),(40,40,43,'ACCEPTED'),(41,41,42,'ACCEPTED'),(42,41,43,'ACCEPTED'),(43,42,43,'ACCEPTED'),(44,43,38,'ACCEPTED'),(45,43,39,'ACCEPTED'),(46,43,40,'ACCEPTED'),(47,43,41,'ACCEPTED'),(48,43,42,'ACCEPTED'),(49,42,38,'ACCEPTED'),(50,42,39,'ACCEPTED'),(51,42,40,'ACCEPTED'),(52,42,41,'ACCEPTED'),(53,41,38,'ACCEPTED'),(54,41,39,'ACCEPTED'),(55,41,40,'ACCEPTED'),(56,40,38,'ACCEPTED'),(57,40,39,'ACCEPTED'),(58,39,38,'ACCEPTED'),(59,29,28,'ACCEPTED'),(60,28,29,'ACCEPTED'),(63,27,33,'ACCEPTED'),(64,33,27,'ACCEPTED');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` int DEFAULT NULL,
  `host_id` int unsigned NOT NULL,
  `game_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_name` (`host_id`),
  CONSTRAINT `fk_user_name` FOREIGN KEY (`host_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (282,'123',NULL,43,0),(283,'qwdqw',NULL,30,0);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_id` int unsigned DEFAULT NULL,
  `login_root` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `nickname` (`nickname`),
  KEY `fk_user_room` (`room_id`),
  CONSTRAINT `fk_user_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (25,'sksmstjswls2','김선진','선진','$2a$10$1Mz.RmT1bwJzU0h70elKkeqXtPP4yYfczGt7B7PUJmv2Yum/Tkd.O','gene1996@naver.com',283,'local',1),(26,'dleogus','dleogus','dleogus','$2a$10$AGh6afCVcryDXLxSWajkaOe/f.rdVzkvuLt07QrmLqTl50GJ4h2ba','dleogus@dleogus.dleogus',NULL,'local',0),(27,'UserTest1','승발롬','승발롬','$2a$10$SS4wzvXKfVC10HlfmItYlOtp9yH9H3vx4zi5irwCXWDxFZtUmVtO6','123@123.com',NULL,'local',1),(28,'gd30220','qkrwhdrud','공통','$2a$10$HxMlwKqS30mUlG3kuHfUtOFi82N0g982pRXxOz/CBMYCt3.fmJSlO','gd122572@gmail.com',NULL,'local',0),(29,'travelgo','김승윤','기무승윤','$2a$10$MQHgVnf8GNCHwO8MG7EMsO9rmqjrnK5GzrtKz1s48GTW7uDuqiUdu','rlatmddbsk75@naver.com',NULL,'local',0),(30,'rlatjswls111','김선진','진선','$2a$10$aztTMJP825jmLIqF.xxUYeeqOl4ja82XAzvSlCDXv/VFYfjHhvIs6','rlatjswls111@gmail.com',283,'local',1),(31,'xptmxm','xptmxm','xptmxm','$2a$10$38uBkRIaRtjaN3CxSN25kOPftLR61rZxPtkHT3zX0bZ0EHYVrsga6','xptmxm@xptmxm.xptmxm',NULL,'local',1),(32,'eoeoeo','eoeoeo','eoeoeo','$2a$10$gwygm/6SYxuMoj/B.Nmm0.Kw2n27PuRYJeAOs0IKfX7JYX//.X8/S','eddy1219@naver.com',NULL,'local',0),(33,'skw_test','신경원','skw_test','$2a$10$yoB5cHF2av9UpxGfmsDVDezsqxXafOSJOKkwSDrJZM.qCGj1BhMQ6','yukihusiru18@gmail.com',NULL,'local',1),(34,'UserTest2','이대현짱짱','김경환','$2a$10$lCKneraacK5thCRz6DAY0uZX7W9GjdXM3YoodrjFAJZK9aa73uu16','qwe@we.com',NULL,'local',1),(35,'gd302201','qkrwhdrud','qkrwhdrud','$2a$10$Lmrl.nOGBgry8vMqmHVOBeIu/cNgSIblL7B1ciFE.m.9GvUrBjMwa','gd@gmail.com',NULL,'local',0),(36,'UserTest3','UserTest3','UserTest3','$2a$10$4YM2x1lurg3DpZRKARWMKOLXD9AdcBWr3bm7Fxcm5dRwsk72Q0/fS','asd@asdf.com',NULL,'local',0),(37,'UserTest4','UserTest4','UserTest4','$2a$10$4brPRKpBNkjoPLiknAz9HO9z9VGXPCaZrHRb5Lxe30021w6vBwPW6','aaasd@ffasdf.com',NULL,'local',0),(38,'ssafy1','ssafy1','ssafy1','$2a$10$YmDgtbxlDLuZQQIl90Rw3eflrxB5dBPG58ZLwtt/WGixFsu2/sJnq','lesihiw436@jarars.com',NULL,'local',0),(39,'ssafy2','ssafy2','ssafy2','$2a$10$vactshTfWpYC6.VWPHzn8O1gRxFvl2XhGOT6bigBuOV5cj7NwrUrG','pawije3395@bitflirt.com',NULL,'local',1),(40,'ssafy3','ssafy3','ssafy3','$2a$10$puigDDvJq0ejIniW0OMfsebAuU8TZDmJTKcq6V.wUwdSRfm60fx06','kovabor226@codverts.com',NULL,'local',0),(41,'ssafy4','ssafy4','ssafy4','$2a$10$2K4qR9M1x.GBIK.xIsL9CeAcCwpcMXx5jGbSW7p3fvTpSrdqqmFEm','sorel64953@envoes.com',283,'local',1),(42,'ssafy5','ssafy5','ssafy5','$2a$10$CNDvtiRk.ec.eT5q0eGfeemZ9b/30MJhdyxM6BqzgU48DfotS.ehO','tibinih921@btcours.com',NULL,'local',1),(43,'ssafy6','ssafy6','ssafy6','$2a$10$C.A9sC8yKdQ8h2MEK0D/aOKqky.JJLLFyVxxOBkcFXG2Ob/YR3izG','mesapif997@codverts.com',282,'local',1),(44,'UserTest5','UserTest5','UserTest5','$2a$10$eadO6I6ejpTzEamBZPOdI.FYKWLHOHPMBy2aUAIqvo6PiqXDJWTIy','123@123sss.com',NULL,'local',0),(45,'123123','공통','공통1','$2a$10$7JiDHMiBVbpcUzXvlR54XuRUDjHsn2qK1irCpaEQkuv5rps.5Z8zG','gd@ga.com',NULL,'local',0),(46,'qwer','니얼굴','니얼굴','$2a$10$2HryCXm7sYsMD/o9pa5YTeGPzFxjw6Os.ctg0NvifNfxDCs3tgF3W','sldjfrnf@gmail.com',NULL,'local',0),(47,'tmdduf785','오승열','오리통통','$2a$10$TpU43r8beNkNauKvL8bTl.0gMTgzfDkMnORrL8VoV2kz1IagwFnZC','tmdduf785@naver.com',NULL,'local',0),(48,'2m7r','임가현','2m7r','$2a$10$OZqStd6rNF42qQRxHWaxWe2vXu993myrkaADFvTDfEctflhlgwdza','2m7r.sw@gmail.com',NULL,'local',0),(49,'ronaldo','asd','asd','$2a$10$4TXfxcIwkk7Pzjqbmf/y7eCMRK725./3xYrxdu34Osebm4iWy1Fx6','tkdgh6427@naver.com',NULL,'local',1),(50,'xoghd14','민태홍','지훈통통','$2a$10$9P9jbzp6gUOoSBZjurtbG..A4C816GA/ommD0VPMY8KT/92PwIyO.','xoghd32@naver.com',NULL,'local',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-20 12:02:42
