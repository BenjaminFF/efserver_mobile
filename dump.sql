-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ewordfun_mobile
-- ------------------------------------------------------
-- Server version	8.0.17

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
-- Table structure for table `folder`
--

DROP TABLE IF EXISTS `folder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folder` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `authorid` char(12) NOT NULL,
  `name` char(30) NOT NULL,
  `description` char(255) DEFAULT NULL,
  `createtime` bigint(20) NOT NULL,
  PRIMARY KEY (`fid`),
  UNIQUE KEY `folder_fid_uindex` (`fid`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folder`
--

LOCK TABLES `folder` WRITE;
/*!40000 ALTER TABLE `folder` DISABLE KEYS */;
INSERT INTO `folder` VALUES (26,'7icjzc9x56p','game of throne','1',1566030511073);
/*!40000 ALTER TABLE `folder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folder_set`
--

DROP TABLE IF EXISTS `folder_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folder_set` (
  `fid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  UNIQUE KEY `folder_set_fid_sid_uindex` (`fid`,`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folder_set`
--

LOCK TABLES `folder_set` WRITE;
/*!40000 ALTER TABLE `folder_set` DISABLE KEYS */;
/*!40000 ALTER TABLE `folder_set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `set`
--

DROP TABLE IF EXISTS `set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `set` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `origin_id` char(12) NOT NULL,
  `name` char(30) NOT NULL,
  `description` char(255) DEFAULT NULL,
  `term_count` int(11) DEFAULT NULL,
  `uid` char(12) NOT NULL,
  `authorid` char(12) NOT NULL,
  `createtime` bigint(20) NOT NULL,
  `spell_comb_learncount` int(11) NOT NULL DEFAULT '0',
  `write_learncount` int(11) NOT NULL DEFAULT '0',
  `stared` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `set`
--

LOCK TABLES `set` WRITE;
/*!40000 ALTER TABLE `set` DISABLE KEYS */;
INSERT INTO `set` VALUES (49,'8msjznhieqi','set for tony','set for tony',3,'7icjzc9x56p','7icjzc9x56p',1566526634012,0,0,0),(50,'43sjznji375','set for benjamin','set for benjamin',3,'a8jzdw6df5','a8jzdw6df5',1566529978289,0,0,0),(51,'8msjznhieqi','set for tony','set for tony',3,'a8jzdw6df5','7icjzc9x56p',1566526634012,0,0,0);
/*!40000 ALTER TABLE `set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `set_term`
--

DROP TABLE IF EXISTS `set_term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `set_term` (
  `sid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `stared` tinyint(1) DEFAULT '0',
  `spell_comb_learned` tinyint(1) NOT NULL DEFAULT '0',
  `write_learned` tinyint(1) NOT NULL DEFAULT '0',
  `uid` char(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `set_term`
--

LOCK TABLES `set_term` WRITE;
/*!40000 ALTER TABLE `set_term` DISABLE KEYS */;
INSERT INTO `set_term` VALUES (49,64,0,0,0,'7icjzc9x56p'),(49,65,0,0,0,'7icjzc9x56p'),(49,66,0,0,0,'7icjzc9x56p'),(50,67,0,0,0,'a8jzdw6df5'),(50,68,0,0,0,'a8jzdw6df5'),(50,69,0,0,0,'a8jzdw6df5'),(51,64,0,0,0,'a8jzdw6df5'),(51,65,0,0,0,'a8jzdw6df5'),(51,66,0,0,0,'a8jzdw6df5');
/*!40000 ALTER TABLE `set_term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `term`
--

DROP TABLE IF EXISTS `term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `term` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `origin_id` char(12) NOT NULL,
  `term` char(32) NOT NULL,
  `definition` varchar(512) DEFAULT NULL,
  `authorid` char(12) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `term`
--

LOCK TABLES `term` WRITE;
/*!40000 ALTER TABLE `term` DISABLE KEYS */;
INSERT INTO `term` VALUES (64,'8msjznhieqi','term1','definition1','7icjzc9x56p'),(65,'8msjznhieqi','term2','definition2','7icjzc9x56p'),(66,'8msjznhieqi','term3','definition3','7icjzc9x56p'),(67,'43sjznji375','term4','definition4','a8jzdw6df5'),(68,'43sjznji375','term5','definition5','a8jzdw6df5'),(69,'43sjznji375','term6','definition6','a8jzdw6df5');
/*!40000 ALTER TABLE `term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uid` char(12) NOT NULL,
  `name` char(30) NOT NULL,
  `password` varchar(512) NOT NULL,
  `createtime` bigint(20) NOT NULL,
  `email` char(64) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('7icjzc9x56p','本杰明','7f3c062810e5ba079c5aa585f42c9d56',1565848756609,'990460889@qq.com'),('a8jzdw6df5','托尼','7f3c062810e5ba079c5aa585f42c9d56',1565946604912,'1781530289@qq.com');
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

-- Dump completed on 2019-08-23 16:58:11
