package com.charity.charity.service;

import com.charity.charity.model.Donation;
import com.charity.charity.model.Event;
import com.charity.charity.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import java.util.List;
import com.charity.charity.repository.DonationRepository;
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private DonationRepository donationRepository;
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, Event eventDetails) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        event.setName(eventDetails.getName());
        event.setDate(eventDetails.getDate());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
       // Event event = eventRepository.findById(eventId).orElseThrow();
       // eventRepository.delete(event);
        Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

    // Remove event reference from donations
    List<Donation> donations = donationRepository.findByEvent(event);
    for (Donation d : donations) {
        d.setEvent(null);  // Keep donation, clear event reference
        d.setEventName(event.getName()); // store name manually
        donationRepository.save(d);
    }

    eventRepository.delete(event);
    }

    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId).orElseThrow();
    }
}
