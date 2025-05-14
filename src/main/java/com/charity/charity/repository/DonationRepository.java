package com.charity.charity.repository;

import com.charity.charity.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.charity.charity.model.Event;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByEvent(Event event);
    List<Donation> findByUserId(Long userId);
}
