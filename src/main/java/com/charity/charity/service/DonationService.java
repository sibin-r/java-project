package com.charity.charity.service;
import java.util.*;
import com.charity.charity.model.Donation;
import com.charity.charity.repository.DonationRepository;
import com.charity.charity.repository.EventRepository;
import com.charity.charity.repository.UserRepository;
import com.charity.charity.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.charity.charity.model.Event;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository; 

    public Donation donateToEvent(Long eventId, Donation donation) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        donation.setEvent(event);
    
        Donation savedDonation = donationRepository.save(donation);
    
        // Update the event total after saving the donation
        event.setTotalAmount(event.getTotalAmount() + donation.getAmount());
        eventRepository.save(event);
        return savedDonation;
      //  donation.setEvent(eventRepository.findById(eventId).orElseThrow());
       // return donationRepository.save(donation);
    }
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
    public Donation saveDonation(Donation donation) {
        Donation savedDonation = donationRepository.save(donation);

        // Update total amount in related event
        Event event = donation.getEvent();
        if (event != null) {
            double newTotal = event.getTotalAmount() + donation.getAmount();
            event.setTotalAmount(newTotal);
            eventRepository.save(event);
        }

        return savedDonation;
    }
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
    public List<Donation> getDonationsByUserId(Long userId) {
        return donationRepository.findByUserId(userId);
    }
}
