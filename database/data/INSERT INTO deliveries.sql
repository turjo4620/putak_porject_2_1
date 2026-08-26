INSERT INTO deliveries (delivery_id, order_id, tracking_no, delivered_via, dispatch_date, est_date, delivered_at, status, courier_id, delivery_charge)
VALUES
(1, 1, 'SP-DHK-000123', 'Sundarban Courier', '2026-08-10 09:30:00', '2026-08-13 18:00:00', '2026-08-13 15:45:00', 'Delivered', 6, 60),
(2, 2, 'PTH-DHK-004521', 'Pathao Courier', '2026-08-12 11:00:00', '2026-08-14 20:00:00', '2026-08-14 17:20:00', 'Delivered', 4, 80),
(3, 3, 'RDX-CTG-009988', 'RedX', '2026-08-15 08:15:00', '2026-08-17 18:00:00', NULL, 'In Transit', 5, 100),
(4, 4, 'PTH-SYL-002211', 'Pathao Courier', '2026-08-16 10:45:00', '2026-08-19 18:00:00', NULL, 'Pending', 4, 120),
(5, 5, 'SP-KHL-007765', 'Sundarban Courier', '2026-08-09 14:00:00', '2026-08-12 18:00:00', '2026-08-12 10:10:00', 'Delivered', 6, 70);
