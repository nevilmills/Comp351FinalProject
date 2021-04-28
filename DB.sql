-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 28, 2021 at 02:05 AM
-- Server version: 5.7.34
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `manroopk_finalproj`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminstats`
--

CREATE TABLE `adminstats` (
  `method` varchar(1000) NOT NULL,
  `endpoint` varchar(1000) NOT NULL,
  `requests` int(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `adminstats`
--

INSERT INTO `adminstats` (`method`, `endpoint`, `requests`) VALUES
('PUT', '/API/v1/updatehighscore', 1),
('GET', '/API/v1/getleaderboard', 1),
('POST', '/API/v1/adminstats', 0),
('POST', '/API/v1/register', 2),
('GET', '/API/v1/login', 3),
('DELETE', '/API/v1/deleteUser', 1);

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `username` varchar(1000) NOT NULL,
  `highscore` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `leaderboard`
--

INSERT INTO `leaderboard` (`username`, `highscore`) VALUES
('new account', 604);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(16) NOT NULL,
  `password` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`) VALUES
('new account', '123456'),
('roopky', '12345'),
('test', '123456'),
('testing', '12345');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD KEY `fk_has_username` (`username`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `fk_has_username` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
