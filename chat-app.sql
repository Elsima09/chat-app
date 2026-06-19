-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 19, 2026 at 04:56 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat-app`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `media_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('sent','delivered','read') COLLATE utf8mb4_general_ci DEFAULT 'sent',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reply_to_id` bigint DEFAULT NULL,
  `forwarded_from_id` bigint DEFAULT NULL,
  `deleted_for_everyone` tinyint(1) NOT NULL DEFAULT '0',
  `media_type` enum('image','audio','document') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `media_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `media_size` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `media_url`, `status`, `created_at`, `reply_to_id`, `forwarded_from_id`, `deleted_for_everyone`, `media_type`, `media_name`, `media_size`) VALUES
(12, 5, 1, 'p', NULL, 'read', '2026-06-19 16:49:54', NULL, NULL, 0, NULL, NULL, NULL),
(13, 1, 5, 'apa', NULL, 'read', '2026-06-19 16:51:03', NULL, NULL, 0, NULL, NULL, NULL),
(14, 5, 1, 'nda kd', NULL, 'read', '2026-06-19 16:51:36', NULL, NULL, 0, NULL, NULL, NULL),
(15, 1, 5, 'oke oe', NULL, 'read', '2026-06-19 16:51:45', NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `message_hidden_for_user`
--

CREATE TABLE `message_hidden_for_user` (
  `id` int NOT NULL,
  `message_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_reactions`
--

CREATE TABLE `message_reactions` (
  `id` int NOT NULL,
  `message_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `emoji` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message_reactions`
--

INSERT INTO `message_reactions` (`id`, `message_id`, `user_id`, `emoji`, `created_at`) VALUES
(3, 15, 1, '👍', '2026-06-19 16:52:16');

-- --------------------------------------------------------

--
-- Table structure for table `starred_messages`
--

CREATE TABLE `starred_messages` (
  `id` int NOT NULL,
  `message_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `starred_messages`
--

INSERT INTO `starred_messages` (`id`, `message_id`, `user_id`, `created_at`) VALUES
(3, 14, 5, '2026-06-19 16:53:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'default.png',
  `is_online` tinyint(1) DEFAULT '0',
  `last_seen` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `avatar`, `is_online`, `last_seen`, `avatar_url`) VALUES
(1, 'khairul', '$2b$10$E3Yvg4gRUM4gUKS1IgbgeeL114xtjMVMY.bicJd.gdAGXgMbqgw5G', 'default.png', 1, '2026-06-19 16:50:59', NULL),
(3, 'tes', '$2b$10$Bbb/q2RzrZHpz5XU7cBVQ.PmV4YikljDX0FZLOMZOJzbiSkh52fHq', 'default.png', 1, '2026-06-19 16:44:08', NULL),
(5, 'tes1', '$2b$10$pIh7GOYo9vaxMhmwUkj8bONcx8Sw3aBJDfVIarFbHJpDZLK1DAiru', 'default.png', 0, '2026-06-19 16:53:49', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `fk_messages_reply_to` (`reply_to_id`),
  ADD KEY `fk_messages_forwarded_from` (`forwarded_from_id`);

--
-- Indexes for table `message_hidden_for_user`
--
ALTER TABLE `message_hidden_for_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_hide_per_user` (`message_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `message_reactions`
--
ALTER TABLE `message_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_reaction_per_user` (`message_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `starred_messages`
--
ALTER TABLE `starred_messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_star_per_user` (`message_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `message_hidden_for_user`
--
ALTER TABLE `message_hidden_for_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `message_reactions`
--
ALTER TABLE `message_reactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `starred_messages`
--
ALTER TABLE `starred_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_forwarded_from` FOREIGN KEY (`forwarded_from_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_messages_reply_to` FOREIGN KEY (`reply_to_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `message_hidden_for_user`
--
ALTER TABLE `message_hidden_for_user`
  ADD CONSTRAINT `message_hidden_for_user_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_hidden_for_user_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_reactions`
--
ALTER TABLE `message_reactions`
  ADD CONSTRAINT `message_reactions_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `starred_messages`
--
ALTER TABLE `starred_messages`
  ADD CONSTRAINT `starred_messages_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `starred_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
